import React, { useEffect, useMemo, useState } from "react";
import { ExternalLink, Info, MapPin } from "lucide-react";
import AxiosApi from "../../../api/AxiosApi";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageLocalStyle";

const getResponseData = (response) => response?.data?.data ?? response?.data;

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
  const [regionGroups, setRegionGroups] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const districts = useMemo(() => {
    return (
      regionGroups.find((region) => region.code === selectedCity)?.districts ||
      []
    );
  }, [regionGroups, selectedCity]);

  const selectedCityName =
    regionGroups.find((region) => region.code === selectedCity)?.name || "지역";
  const selectedDistrictName =
    districts.find((district) => district.code === selectedDistrict)?.name ||
    "선택 안 됨";

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

  const saveRegion = async () => {
    if (!selectedCity || !selectedDistrict) {
      setStatusMessage("지역을 선택해 주세요.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    try {
      // 관심 지역 저장 API는 지역명이 아니라 법정동 코드 2개를 받습니다.
      await AxiosApi.updateMyRegion({
        ldongRegnCd: selectedCity,
        ldongSignguCd: selectedDistrict,
      });
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

            <S.MapCard aria-label="선택 지역 지도 시각화">
              <S.MapHeader>
                <S.MapTitle>MAP VISUALIZATION</S.MapTitle>
                <S.LiveBadge>
                  <span aria-hidden="true" />
                  LIVE
                </S.LiveBadge>
              </S.MapHeader>
              <S.MapCanvas>
                <S.GridLines aria-hidden="true" />
                <S.MapGlow aria-hidden="true" />
                <S.PinPulse aria-hidden="true">
                  <MapPin size={22} fill="currentColor" />
                </S.PinPulse>
                <S.MapLabel>
                  {selectedCityName} {selectedDistrictName}
                </S.MapLabel>
              </S.MapCanvas>
            </S.MapCard>
          </S.Panel>
        </S.Content>
      </S.Container>
    </S.Page>
  );
}

export default MyPageLocal;
