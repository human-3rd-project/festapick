import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Landmark,
  Leaf,
  MapPin,
  Music,
  Package,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import AxiosApi from "../../api/AxiosApi";
import * as S from "./CalendarStyle";

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const themes = [
  { id: "culturalTourism", name: "문화관광축제", icon: MapPin },
  { id: "culturalArts", name: "문화예술축제", icon: Music },
  { id: "localSpecialty", name: "지역특산물축제", icon: Package },
  { id: "traditionalHistory", name: "전통역사축제", icon: Landmark },
  { id: "ecoNature", name: "생태자연축제", icon: Leaf },
  { id: "etc", name: "기타축제", icon: Sparkles },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80";

// ApiResponse<T>와 axios response 양쪽 형태에서 실제 data만 꺼냅니다.
const getResponseData = (response) => response?.data?.data ?? response?.data;

// LegalDongCodes 목록을 캘린더 필터 선택 UI에서 쓰는 시/도, 시/군/구 구조로 묶습니다.
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

const getThemeIdByName = (categoryName) => {
  const matchedTheme = themes.find((theme) => theme.name === categoryName);

  return matchedTheme?.id || "";
};

// CalendarResDto/FestivalInfoResponseDto를 캘린더 UI에서 쓰는 일정 객체로 변환합니다.
const mapCalendarFestival = (festival) => {
  const regionName = festival.regionName || festival.addr1 || "";

  return {
    id: festival.festivalId,
    title: festival.title || "제목 없는 축제",
    date: festival.eventStartDate,
    endDate: festival.eventEndDate,
    city: regionName,
    district: regionName,
    theme: getThemeIdByName(festival.categoryName),
    category: festival.categoryName,
    isFavorite: Boolean(festival.favorite),
    image: festival.thumbnailUrl || festival.firstImage || fallbackImage,
    description: festival.categoryName || "축제",
  };
};

const createDateKey = (year, monthIndex, day) =>
  `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;

function Calendar() {
  const [viewDate, setViewDate] = useState(new Date());
  const [festivals, setFestivals] = useState([]);
  const [regionGroups, setRegionGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showFavoriteMarks, setShowFavoriteMarks] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [draftCity, setDraftCity] = useState("");
  const [draftDistrict, setDraftDistrict] = useState("");
  const [draftThemes, setDraftThemes] = useState([]);

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();
  const monthTitle = `${year}년 ${monthIndex + 1}월`;
  const draftCityGroup = regionGroups.find(
    (region) => region.code === draftCity,
  );
  const draftDistricts = draftCityGroup?.districts || [];

  useEffect(() => {
    const loadRegionFilters = async () => {
      try {
        // 캘린더 필터 지역 목록은 하드코딩하지 않고 백엔드 필터 API에서 불러옵니다.
        const response = await AxiosApi.getCalendarRegionFilters();
        const groups = buildRegionGroups(getResponseData(response) || []);

        setRegionGroups(groups);
      } catch (error) {
        setRegionGroups([]);
      }
    };

    loadRegionFilters();
  }, []);

  useEffect(() => {
    const loadFestivals = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // 로그인 사용자는 찜 여부까지 포함된 캘린더 필터 API를 우선 사용합니다.
        const response = await AxiosApi.getFilteredCalendars({
          year,
          month: monthIndex + 1,
          page: 0,
          size: 200,
        });
        const pageData = getResponseData(response);
        const content = pageData?.content || [];

        setFestivals(content.map(mapCalendarFestival));
      } catch (privateError) {
        try {
          // 비로그인 또는 인증 실패 시 공개 캘린더 월별 축제 API로 한 번 더 조회합니다.
          const targetMonth = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
          const response =
            await AxiosApi.getCalendarMonthlyFestivals(targetMonth);
          const data = getResponseData(response) || [];

          setFestivals(data.map(mapCalendarFestival));
        } catch (publicError) {
          setFestivals([]);
          setErrorMessage(
            publicError.response?.data?.message ||
              privateError.response?.data?.message ||
              "축제 일정을 불러오지 못했습니다.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadFestivals();
  }, [monthIndex, year]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const lastDate = new Date(year, monthIndex + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, (_, index) => ({
      key: `blank-${index}`,
      day: null,
    }));
    const days = Array.from({ length: lastDate }, (_, index) => {
      const day = index + 1;

      return {
        key: createDateKey(year, monthIndex, day),
        day,
      };
    });

    return [...blanks, ...days];
  }, [monthIndex, year]);

  const filteredFestivals = useMemo(() => {
    const selectedCityName =
      regionGroups.find((region) => region.code === selectedCity)?.name || "";
    const selectedDistrictName =
      regionGroups
        .find((region) => region.code === selectedCity)
        ?.districts.find((district) => district.code === selectedDistrict)
        ?.name || "";

    return festivals.filter((festival) => {
      const matchesCity =
        !selectedCity || festival.city.includes(selectedCityName);
      const matchesDistrict =
        !selectedDistrict || festival.district.includes(selectedDistrictName);
      const matchesTheme =
        selectedThemes.length === 0 || selectedThemes.includes(festival.theme);

      return matchesCity && matchesDistrict && matchesTheme;
    });
  }, [festivals, regionGroups, selectedCity, selectedDistrict, selectedThemes]);

  const festivalsByDate = useMemo(() => {
    return filteredFestivals.reduce((map, festival) => {
      const current = map.get(festival.date) || [];
      map.set(festival.date, [...current, festival]);

      return map;
    }, new Map());
  }, [filteredFestivals]);

  const moveMonth = (offset) => {
    setViewDate(new Date(year, monthIndex + offset, 1));
  };

  const openFilter = () => {
    setDraftCity(selectedCity);
    setDraftDistrict(selectedDistrict);
    setDraftThemes(selectedThemes);
    setIsFilterOpen(true);
  };

  const resetFilter = () => {
    setDraftCity("");
    setDraftDistrict("");
    setDraftThemes([]);
  };

  const applyFilter = () => {
    setSelectedCity(draftCity);
    setSelectedDistrict(draftDistrict);
    setSelectedThemes(draftThemes);
    setIsFilterOpen(false);
  };

  const changeDraftCity = (event) => {
    const nextCity = event.target.value;
    setDraftCity(nextCity);
    setDraftDistrict("");
  };

  const toggleDraftTheme = (themeId) => {
    setDraftThemes((currentThemes) =>
      currentThemes.includes(themeId)
        ? currentThemes.filter((currentTheme) => currentTheme !== themeId)
        : [...currentThemes, themeId],
    );
  };

  const getFestivalLink = (festival) => ({
    to: `/festivals/${festival.id}`,
    state: {
      festival: {
        ...festival,
        name: festival.title,
        location: `${festival.city} ${festival.district}`,
        venue: `${festival.city} ${festival.district}`,
        favorite: festival.isFavorite,
      },
    },
  });

  const draftFilterCount = draftThemes.length;

  return (
    <S.Page>
      <S.Content>
        <S.HeaderRow>
          <S.TitleGroup>
            <S.Title>페스티벌 일정</S.Title>
            <S.Description>
              {isLoading
                ? "축제 일정을 불러오는 중입니다."
                : errorMessage || "이번 달의 뜨거운 열기를 미리 확인하세요."}
            </S.Description>
          </S.TitleGroup>
          <S.Toolbar>
            <S.ToolButton type="button" onClick={openFilter}>
              <SlidersHorizontal size={15} aria-hidden="true" /> 필터
            </S.ToolButton>
            <S.ToolButton
              type="button"
              $active={showFavoriteMarks}
              onClick={() => setShowFavoriteMarks((current) => !current)}
            >
              <Heart
                size={15}
                fill={showFavoriteMarks ? "currentColor" : "none"}
                aria-hidden="true"
              />
              찜한 축제 표시
            </S.ToolButton>
          </S.Toolbar>
        </S.HeaderRow>

        <S.CalendarPanel>
          <S.CalendarHeader>
            <S.MonthButton
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label="이전 달"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </S.MonthButton>
            <S.MonthTitle>{monthTitle}</S.MonthTitle>
            <S.MonthButton
              type="button"
              onClick={() => moveMonth(1)}
              aria-label="다음 달"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </S.MonthButton>
          </S.CalendarHeader>

          <S.WeekGrid>
            {weekDays.map((day) => (
              <S.WeekDay key={day}>{day}</S.WeekDay>
            ))}
          </S.WeekGrid>

          <S.DayGrid>
            {calendarDays.map((calendarDay) => {
              const dayFestivals = calendarDay.day
                ? festivalsByDate.get(calendarDay.key) || []
                : [];

              return calendarDay.day ? (
                <S.DayCell
                  key={calendarDay.key}
                  $hasFestival={dayFestivals.length > 0}
                >
                  <S.DayNumber>{calendarDay.day}</S.DayNumber>
                  <S.EventList>
                    {dayFestivals.slice(0, 3).map((festival) => (
                      <S.EventPill
                        key={festival.id}
                        to={getFestivalLink(festival).to}
                        state={getFestivalLink(festival).state}
                        aria-label={`${festival.title} 상세 보기`}
                      >
                        <span>{festival.title}</span>
                        {showFavoriteMarks && festival.isFavorite && (
                          <Heart
                            size={11}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                        )}
                      </S.EventPill>
                    ))}
                  </S.EventList>
                </S.DayCell>
              ) : (
                <S.EmptyCell key={calendarDay.key} />
              );
            })}
          </S.DayGrid>
        </S.CalendarPanel>
      </S.Content>

      {isFilterOpen && (
        <S.ModalOverlay role="presentation">
          <S.FilterModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
          >
            <S.ModalHeader>
              <S.ModalTitle id="filter-title">축제 필터</S.ModalTitle>
              <S.CloseButton
                type="button"
                onClick={() => setIsFilterOpen(false)}
                aria-label="필터 닫기"
              >
                <X size={17} aria-hidden="true" />
              </S.CloseButton>
            </S.ModalHeader>

            <S.FilterSection>
              <S.FilterLabelRow>
                <S.FilterLabel>지역</S.FilterLabel>
                <S.FilterHelp>선택 사항</S.FilterHelp>
              </S.FilterLabelRow>
              <S.SelectGrid>
                <S.Select value={draftCity} onChange={changeDraftCity}>
                  <option value="">시/도 선택</option>
                  {regionGroups.map((city) => (
                    <option key={city.code} value={city.code}>
                      {city.name}
                    </option>
                  ))}
                </S.Select>
                <S.Select
                  value={draftDistrict}
                  onChange={(event) => setDraftDistrict(event.target.value)}
                  disabled={!draftCity}
                >
                  <option value="">시/군/구 선택</option>
                  {draftDistricts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </S.Select>
              </S.SelectGrid>
            </S.FilterSection>

            <S.FilterSection>
              <S.FilterLabel>축제 테마</S.FilterLabel>
              <S.ThemeGrid>
                {themes.map(({ id, name, icon: Icon }) => (
                  <S.ThemeButton
                    key={id}
                    type="button"
                    $active={draftThemes.includes(id)}
                    onClick={() => toggleDraftTheme(id)}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{name}</span>
                  </S.ThemeButton>
                ))}
              </S.ThemeGrid>
            </S.FilterSection>

            <S.ModalActions>
              <S.ResetButton type="button" onClick={resetFilter}>
                <RotateCcw size={14} aria-hidden="true" /> 초기화
              </S.ResetButton>
              <S.ApplyButton type="button" onClick={applyFilter}>
                필터 적용
              </S.ApplyButton>
            </S.ModalActions>
          </S.FilterModal>
        </S.ModalOverlay>
      )}
    </S.Page>
  );
}

export default Calendar;
