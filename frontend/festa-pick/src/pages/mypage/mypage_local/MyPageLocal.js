import React, { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Info } from "lucide-react";
import AxiosApi from "../../../api/AxiosApi";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import { useAuth } from "../../../context/AuthContext";
import * as S from "./MyPageLocalStyle";

const getResponseData = (response) => response?.data?.data ?? response?.data;
const KAKAO_MAP_SDK_ID = "kakao-map-sdk";

let kakaoMapLoaderPromise = null;

const loadKakaoMapSdk = () => {
  if (window.kakao?.maps?.services) {
    return Promise.resolve(window.kakao);
  }

  const appKey = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY;

  if (!appKey) {
    return Promise.reject(new Error("Kakao Maps JavaScript key is missing."));
  }

  if (!kakaoMapLoaderPromise) {
    kakaoMapLoaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(KAKAO_MAP_SDK_ID);

      const handleLoad = () => {
        if (!window.kakao?.maps) {
          reject(new Error("Kakao Maps SDK failed to initialize."));
          return;
        }

        window.kakao.maps.load(() => {
          if (!window.kakao.maps.services) {
            reject(new Error("Kakao Maps services library is missing."));
            return;
          }

          resolve(window.kakao);
        });
      };

      if (existingScript) {
        if (window.kakao?.maps) {
          handleLoad();
          return;
        }

        existingScript.addEventListener("load", handleLoad, { once: true });
        existingScript.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = KAKAO_MAP_SDK_ID;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
        appKey,
      )}&libraries=services&autoload=false`;
      script.async = true;
      script.addEventListener("load", handleLoad, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  return kakaoMapLoaderPromise;
};

// LegalDongCodes 목록을 시/도 선택과 시/군/구 선택에 맞는 구조로 묶습니다.
const buildRegionGroups = (items) => {
  const grouped = new Map();

  items.forEach((item) => {
    const cityCode = item.ldongRegnCd;
    const district = {
      code: item.ldongSignguCd,
      name: item.sigunguName,
      fullName: item.fullName,
    };

    if (!grouped.has(cityCode)) {
      grouped.set(cityCode, {
        code: cityCode,
        name: item.sidoName,
        districts: [],
      });
    }

    grouped.get(cityCode).districts.push(district);
  });

  return Array.from(grouped.values());
};

function MyPageLocal() {
  const auth = useAuth();
  const mapContainerRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const kakaoMarkerRef = useRef(null);
  const [regionGroups, setRegionGroups] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [mapMessage, setMapMessage] = useState(
    "지역을 선택하면 지도를 표시합니다.",
  );
  const [isSaving, setIsSaving] = useState(false);

  const selectedCityGroup = useMemo(() => {
    return regionGroups.find((region) => region.code === selectedCity);
  }, [regionGroups, selectedCity]);

  const districts = useMemo(() => {
    return selectedCityGroup?.districts || [];
  }, [selectedCityGroup]);

  const selectedDistrictInfo = useMemo(() => {
    return districts.find((district) => district.code === selectedDistrict);
  }, [districts, selectedDistrict]);

  const selectedCityName = selectedCityGroup?.name || "지역";
  const selectedDistrictName = selectedDistrictInfo?.name || "선택 안 됨";
  const selectedRegionName = useMemo(() => {
    if (selectedDistrictInfo?.fullName) {
      return selectedDistrictInfo.fullName;
    }

    return [selectedCityGroup?.name, selectedDistrictInfo?.name]
      .filter(Boolean)
      .join(" ");
  }, [selectedCityGroup, selectedDistrictInfo]);

  useEffect(() => {
    const loadRegion = async () => {
      try {
        // 메인/주변 추천용 관심 지역 설정에 사용할 축제 지역 목록과 현재 사용자의 관심 지역을 함께 불러옵니다.
        // 팀원 AxiosApi PR의 getFestivalRegionFilters가 /festivals/filters/regions를 호출합니다.
        const [filtersResponse, myRegionResponse] = await Promise.all([
          AxiosApi.getFestivalRegionFilters(),
          AxiosApi.getMyRegion(),
        ]);
        const groups = buildRegionGroups(
          getResponseData(filtersResponse) || [],
        );
        const myRegion = getResponseData(myRegionResponse);
        const firstRegion = groups[0];
        const firstDistrict = firstRegion?.districts[0];

        setRegionGroups(groups);
        setSelectedCity(myRegion?.ldongRegnCd || firstRegion?.code || "");
        setSelectedDistrict(
          myRegion?.ldongSignguCd || firstDistrict?.code || "",
        );
      } catch (error) {
        // 지역 목록은 백엔드 코드 목록만 사용하므로, 조회 실패 시 선택 목록을 비웁니다.
        setRegionGroups([]);
        setSelectedCity("");
        setSelectedDistrict("");
        setStatusMessage(
          error.response?.data?.message || "지역 정보를 불러오지 못했습니다.",
        );
      }
    };

    loadRegion();
  }, []);

  const changeCity = (event) => {
    const nextCity = event.target.value;
    const nextDistrict =
      regionGroups.find((region) => region.code === nextCity)?.districts[0]
        ?.code || "";

    setSelectedCity(nextCity);
    setSelectedDistrict(nextDistrict);
    setStatusMessage("");
  };

  useEffect(() => {
    let isCancelled = false;

    if (!selectedDistrict || !selectedRegionName) {
      setMapMessage("지역을 선택하면 지도를 표시합니다.");
      return undefined;
    }

    if (!mapContainerRef.current) {
      return undefined;
    }

    setMapMessage(`${selectedRegionName} 지도를 불러오는 중입니다.`);

    loadKakaoMapSdk()
      .then((kakao) => {
        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(selectedRegionName, (results, status) => {
          if (isCancelled) {
            return;
          }

          if (status !== kakao.maps.services.Status.OK || !results?.[0]) {
            setMapMessage("선택한 지역의 좌표를 찾을 수 없습니다.");
            return;
          }

          const center = new kakao.maps.LatLng(
            Number(results[0].y),
            Number(results[0].x),
          );

          if (!kakaoMapRef.current) {
            kakaoMapRef.current = new kakao.maps.Map(mapContainerRef.current, {
              center,
              level: 7,
            });
          } else {
            kakaoMapRef.current.setCenter(center);
            kakaoMapRef.current.setLevel(7);
          }

          kakaoMapRef.current.relayout();
          kakaoMapRef.current.setCenter(center);

          if (kakaoMarkerRef.current) {
            kakaoMarkerRef.current.setMap(null);
          }

          kakaoMarkerRef.current = new kakao.maps.Marker({
            map: kakaoMapRef.current,
            position: center,
            title: selectedRegionName,
          });

          setMapMessage(`${selectedRegionName} 기준 위치입니다.`);
        });
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        const errorMessage = error?.message || "";

        if (errorMessage.includes("key")) {
          setMapMessage("지도 API 키 설정이 필요합니다.");
          return;
        }

        if (errorMessage.includes("services")) {
          setMapMessage("Kakao 지도 주소 변환 기능을 사용할 수 없습니다.");
          return;
        }

        setMapMessage("지도를 불러오지 못했습니다.");
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedDistrict, selectedRegionName]);

  const saveRegion = async () => {
    if (!selectedCity || !selectedDistrict) {
      setStatusMessage("지역을 선택해 주세요.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    try {
      // 관심 지역 저장 API는 지역명이 아니라 법정동 코드 2개를 받습니다.
      const response = await AxiosApi.updateMyRegion({
        ldongRegnCd: selectedCity,
        ldongSignguCd: selectedDistrict,
      });
      const savedRegion = getResponseData(response);

      localStorage.setItem("ldongRegnCd", savedRegion?.ldongRegnCd || selectedCity);
      localStorage.setItem(
        "ldongSignguCd",
        savedRegion?.ldongSignguCd || selectedDistrict,
      );
      localStorage.setItem(
        "userRegion",
        savedRegion?.fullName || selectedRegionName,
      );

      await auth?.fetchCurrentUser?.();
      setStatusMessage("지역 정보가 저장되었습니다.");
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message || "지역 정보를 저장하지 못했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/region" />

        <S.Content>
          <S.Panel>
            <S.FormSection>
              <S.Title>
                활동 지역 설정 <S.RequiredDot aria-hidden="true" />
              </S.Title>

              <S.FieldGroup>
                <S.Label htmlFor="city">시/도 선택</S.Label>
                <S.Select
                  id="city"
                  value={selectedCity}
                  onChange={changeCity}
                  disabled={regionGroups.length === 0}
                >
                  <option value="">시/도 선택</option>
                  {regionGroups.map((city) => (
                    <option key={city.code} value={city.code}>
                      {city.name}
                    </option>
                  ))}
                </S.Select>
              </S.FieldGroup>

              <S.FieldGroup>
                <S.Label htmlFor="district">구/군/시 선택</S.Label>
                <S.Select
                  id="district"
                  value={selectedDistrict}
                  onChange={(event) => setSelectedDistrict(event.target.value)}
                  disabled={!selectedCity || districts.length === 0}
                >
                  <option value="">구/군/시 선택</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </S.Select>
              </S.FieldGroup>

              <S.PrimaryButton
                type="button"
                onClick={saveRegion}
                disabled={isSaving || regionGroups.length === 0}
              >
                {isSaving ? "저장 중" : "지역 정보 저장하기"}
                <ExternalLink size={14} aria-hidden="true" />
              </S.PrimaryButton>

              <S.NoticeBox>
                <Info size={16} aria-hidden="true" />
                <span>
                  선택하신 지역을 기반으로 맞춤형 페스티벌 소식을 가장 먼저
                  추천해드립니다.
                </span>
              </S.NoticeBox>
              {statusMessage && <S.NoticeBox>{statusMessage}</S.NoticeBox>}
            </S.FormSection>

            <S.MapCard aria-label="선택 지역 지도">
              <S.MapHeader>
                <S.MapTitle>REGION MAP</S.MapTitle>
                <S.LiveBadge>
                  <span aria-hidden="true" />
                  KAKAO
                </S.LiveBadge>
              </S.MapHeader>
              <S.MapCanvas
                ref={mapContainerRef}
                aria-label={`${selectedRegionName || "선택 지역"} 지도`}
              />
              <S.MapFooter>
                <S.MapLabel>
                  {selectedRegionName ||
                    `${selectedCityName} ${selectedDistrictName}`}
                </S.MapLabel>
                <S.MapMessage>{mapMessage}</S.MapMessage>
              </S.MapFooter>
            </S.MapCard>
          </S.Panel>
        </S.Content>
      </S.Container>
    </S.Page>
  );
}

export default MyPageLocal;
