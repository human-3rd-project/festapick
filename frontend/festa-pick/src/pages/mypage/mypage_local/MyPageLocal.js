import React, { useEffect, useMemo, useState } from "react";
import { ExternalLink, Info, MapPin } from "lucide-react";
import AxiosApi from "../../../api/AxiosApi";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageLocalStyle";

const regions = {
  서울특별시: [
    "종로구",
    "중구",
    "용산구",
    "성동구",
    "광진구",
    "동대문구",
    "중랑구",
    "성북구",
    "강북구",
    "도봉구",
    "노원구",
    "은평구",
    "서대문구",
    "마포구",
    "양천구",
    "강서구",
    "구로구",
    "금천구",
    "영등포구",
    "동작구",
    "관악구",
    "서초구",
    "강남구",
    "송파구",
    "강동구",
  ],
  부산광역시: [
    "중구",
    "서구",
    "동구",
    "영도구",
    "부산진구",
    "동래구",
    "남구",
    "북구",
    "해운대구",
    "사하구",
    "금정구",
    "강서구",
    "연제구",
    "수영구",
    "사상구",
    "기장군",
  ],
  대구광역시: [
    "중구",
    "동구",
    "서구",
    "남구",
    "북구",
    "수성구",
    "달서구",
    "달성군",
    "군위군",
  ],
  인천광역시: [
    "중구",
    "동구",
    "미추홀구",
    "연수구",
    "남동구",
    "부평구",
    "계양구",
    "서구",
    "강화군",
    "옹진군",
  ],
  광주광역시: ["동구", "서구", "남구", "북구", "광산구"],
  대전광역시: ["동구", "중구", "서구", "유성구", "대덕구"],
  울산광역시: ["중구", "남구", "동구", "북구", "울주군"],
  세종특별자치시: ["세종시"],
  경기도: [
    "수원시",
    "성남시",
    "의정부시",
    "안양시",
    "부천시",
    "광명시",
    "평택시",
    "동두천시",
    "안산시",
    "고양시",
    "과천시",
    "구리시",
    "남양주시",
    "오산시",
    "시흥시",
    "군포시",
    "의왕시",
    "하남시",
    "용인시",
    "파주시",
    "이천시",
    "안성시",
    "김포시",
    "화성시",
    "광주시",
    "양주시",
    "포천시",
    "여주시",
    "연천군",
    "가평군",
    "양평군",
  ],
  강원특별자치도: [
    "춘천시",
    "원주시",
    "강릉시",
    "동해시",
    "태백시",
    "속초시",
    "삼척시",
    "홍천군",
    "횡성군",
    "영월군",
    "평창군",
    "정선군",
    "철원군",
    "화천군",
    "양구군",
    "인제군",
    "고성군",
    "양양군",
  ],
  충청북도: [
    "청주시",
    "충주시",
    "제천시",
    "보은군",
    "옥천군",
    "영동군",
    "증평군",
    "진천군",
    "괴산군",
    "음성군",
    "단양군",
  ],
  충청남도: [
    "천안시",
    "공주시",
    "보령시",
    "아산시",
    "서산시",
    "논산시",
    "계룡시",
    "당진시",
    "금산군",
    "부여군",
    "서천군",
    "청양군",
    "홍성군",
    "예산군",
    "태안군",
  ],
  전북특별자치도: [
    "전주시",
    "군산시",
    "익산시",
    "정읍시",
    "남원시",
    "김제시",
    "완주군",
    "진안군",
    "무주군",
    "장수군",
    "임실군",
    "순창군",
    "고창군",
    "부안군",
  ],
  전라남도: [
    "목포시",
    "여수시",
    "순천시",
    "나주시",
    "광양시",
    "담양군",
    "곡성군",
    "구례군",
    "고흥군",
    "보성군",
    "화순군",
    "장흥군",
    "강진군",
    "해남군",
    "영암군",
    "무안군",
    "함평군",
    "영광군",
    "장성군",
    "완도군",
    "진도군",
    "신안군",
  ],
  경상북도: [
    "포항시",
    "경주시",
    "김천시",
    "안동시",
    "구미시",
    "영주시",
    "영천시",
    "상주시",
    "문경시",
    "경산시",
    "의성군",
    "청송군",
    "영양군",
    "영덕군",
    "청도군",
    "고령군",
    "성주군",
    "칠곡군",
    "예천군",
    "봉화군",
    "울진군",
    "울릉군",
  ],
  경상남도: [
    "창원시",
    "진주시",
    "통영시",
    "사천시",
    "김해시",
    "밀양시",
    "거제시",
    "양산시",
    "의령군",
    "함안군",
    "창녕군",
    "고성군",
    "남해군",
    "하동군",
    "산청군",
    "함양군",
    "거창군",
    "합천군",
  ],
  제주특별자치도: ["제주시", "서귀포시"],
};

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

const buildFallbackRegionGroups = () =>
  Object.entries(regions).map(([cityName, districtNames]) => ({
    code: cityName,
    name: cityName,
    districts: districtNames.map((districtName) => ({
      code: districtName,
      name: districtName,
      fullName: `${cityName} ${districtName}`,
    })),
  }));

function MyPageLocal() {
  const [regionGroups, setRegionGroups] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [usesFallbackRegions, setUsesFallbackRegions] = useState(false);

  const districts = useMemo(() => {
    return (
      regionGroups.find((region) => region.code === selectedCity)?.districts ||
      []
    );
  }, [regionGroups, selectedCity]);

  const selectedCityName =
    regionGroups.find((region) => region.code === selectedCity)?.name ||
    "지역";
  const selectedDistrictName =
    districts.find((district) => district.code === selectedDistrict)?.name ||
    "선택 안 됨";

  useEffect(() => {
    const loadRegion = async () => {
      try {
        // 메인/주변 추천용 관심 지역 설정에 사용할 축제 지역 목록과 현재 사용자의 관심 지역을 함께 불러옵니다.
        // 팀원 AxiosApi PR의 getFestivalRegionFilters가 /festival/filters/regions를 호출합니다.
        const [filtersResponse, myRegionResponse] = await Promise.all([
          AxiosApi.getFestivalRegionFilters(),
          AxiosApi.getMyRegion(),
        ]);
        const groups = buildRegionGroups(getResponseData(filtersResponse) || []);
        const myRegion = getResponseData(myRegionResponse);
        const firstRegion = groups[0];
        const firstDistrict = firstRegion?.districts[0];

        setRegionGroups(groups);
        setUsesFallbackRegions(false);
        setSelectedCity(
          myRegion?.ldongRegnCd || firstRegion?.code || "",
        );
        setSelectedDistrict(
          myRegion?.ldongSignguCd || firstDistrict?.code || "",
        );
      } catch (error) {
        // 필터 조회 실패 시 화면 선택 UI만 유지하고, 코드 저장은 막습니다.
        const fallbackGroups = buildFallbackRegionGroups();

        setRegionGroups(fallbackGroups);
        setUsesFallbackRegions(true);
        setSelectedCity(fallbackGroups[0]?.code || "");
        setSelectedDistrict(fallbackGroups[0]?.districts[0]?.code || "");
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

    if (usesFallbackRegions) {
      // fallback 값은 실제 법정동 코드가 아니므로 백엔드 저장에 쓰지 않습니다.
      setStatusMessage("지역 코드 목록을 불러온 뒤 저장할 수 있습니다.");
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
                <S.Select id="city" value={selectedCity} onChange={changeCity}>
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
                >
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </S.Select>
              </S.FieldGroup>

              <S.PrimaryButton type="button" onClick={saveRegion} disabled={isSaving}>
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
