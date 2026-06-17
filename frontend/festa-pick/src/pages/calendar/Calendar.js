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
  const draftDistricts = draftCity ? regions[draftCity] || [] : [];

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
    return festivals.filter((festival) => {
      const matchesCity = !selectedCity || festival.city.includes(selectedCity);
      const matchesDistrict =
        !selectedDistrict || festival.district.includes(selectedDistrict);
      const matchesTheme =
        selectedThemes.length === 0 || selectedThemes.includes(festival.theme);

      return matchesCity && matchesDistrict && matchesTheme;
    });
  }, [festivals, selectedCity, selectedDistrict, selectedThemes]);

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
                  {Object.keys(regions).map((city) => (
                    <option key={city} value={city}>
                      {city}
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
                    <option key={district} value={district}>
                      {district}
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
                필터 적용 ({draftFilterCount}개)
              </S.ApplyButton>
            </S.ModalActions>
          </S.FilterModal>
        </S.ModalOverlay>
      )}
    </S.Page>
  );
}

export default Calendar;
