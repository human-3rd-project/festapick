import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import {
  ApplyButton,
  CalendarHeader,
  CalendarPanel,
  CloseButton,
  ContentGrid,
  DayCell,
  DayGrid,
  FieldLabel,
  FieldStack,
  LeftColumn,
  ModalBackdrop,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalPanel,
  ModalTitle,
  MonthButton,
  MonthControls,
  MonthLabel,
  ResetButton,
  Section,
  SectionHeader,
  SectionTitle,
  Select,
  SelectWrap,
  WeekGrid,
} from "./FilterModalCss";

const DEFAULT_VALUES = {
  province: "서울특별시",
  district: "강남구",
  location: "서울특별시 강남구",
  period: "2026.06.01 - 06.05",
  theme: "",
};

const DISTRICTS_BY_PROVINCE = {
  서울특별시: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  부산광역시: [
    "강서구",
    "금정구",
    "기장군",
    "남구",
    "동구",
    "동래구",
    "부산진구",
    "북구",
    "사상구",
    "사하구",
    "서구",
    "수영구",
    "연제구",
    "영도구",
    "중구",
    "해운대구",
  ],
  대구광역시: [
    "군위군",
    "남구",
    "달서구",
    "달성군",
    "동구",
    "북구",
    "서구",
    "수성구",
    "중구",
  ],
  인천광역시: [
    "강화군",
    "계양구",
    "남동구",
    "동구",
    "미추홀구",
    "부평구",
    "서구",
    "연수구",
    "옹진군",
    "중구",
  ],
  광주광역시: ["광산구", "남구", "동구", "북구", "서구"],
  대전광역시: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산광역시: ["남구", "동구", "북구", "울주군", "중구"],
  세종특별자치시: ["세종시"],
  경기도: [
    "가평군",
    "고양시",
    "과천시",
    "광명시",
    "광주시",
    "구리시",
    "군포시",
    "김포시",
    "남양주시",
    "동두천시",
    "부천시",
    "성남시",
    "수원시",
    "시흥시",
    "안산시",
    "안성시",
    "안양시",
    "양주시",
    "양평군",
    "여주시",
    "연천군",
    "오산시",
    "용인시",
    "의왕시",
    "의정부시",
    "이천시",
    "파주시",
    "평택시",
    "포천시",
    "하남시",
    "화성시",
  ],
  강원특별자치도: [
    "강릉시",
    "고성군",
    "동해시",
    "삼척시",
    "속초시",
    "양구군",
    "양양군",
    "영월군",
    "원주시",
    "인제군",
    "정선군",
    "철원군",
    "춘천시",
    "태백시",
    "평창군",
    "홍천군",
    "화천군",
    "횡성군",
  ],
  충청북도: [
    "괴산군",
    "단양군",
    "보은군",
    "영동군",
    "옥천군",
    "음성군",
    "제천시",
    "증평군",
    "진천군",
    "청주시",
    "충주시",
  ],
  충청남도: [
    "계룡시",
    "공주시",
    "금산군",
    "논산시",
    "당진시",
    "보령시",
    "부여군",
    "서산시",
    "서천군",
    "아산시",
    "예산군",
    "천안시",
    "청양군",
    "태안군",
    "홍성군",
  ],
  전북특별자치도: [
    "고창군",
    "군산시",
    "김제시",
    "남원시",
    "무주군",
    "부안군",
    "순창군",
    "완주군",
    "익산시",
    "임실군",
    "장수군",
    "전주시",
    "정읍시",
    "진안군",
  ],
  전라남도: [
    "강진군",
    "고흥군",
    "곡성군",
    "광양시",
    "구례군",
    "나주시",
    "담양군",
    "목포시",
    "무안군",
    "보성군",
    "순천시",
    "신안군",
    "여수시",
    "영광군",
    "영암군",
    "완도군",
    "장성군",
    "장흥군",
    "진도군",
    "함평군",
    "해남군",
    "화순군",
  ],
  경상북도: [
    "경산시",
    "경주시",
    "고령군",
    "구미시",
    "김천시",
    "문경시",
    "봉화군",
    "상주시",
    "성주군",
    "안동시",
    "영덕군",
    "영양군",
    "영주시",
    "영천시",
    "예천군",
    "울릉군",
    "울진군",
    "의성군",
    "청도군",
    "청송군",
    "칠곡군",
    "포항시",
  ],
  경상남도: [
    "거제시",
    "거창군",
    "고성군",
    "김해시",
    "남해군",
    "밀양시",
    "사천시",
    "산청군",
    "양산시",
    "의령군",
    "진주시",
    "창녕군",
    "창원시",
    "통영시",
    "하동군",
    "함안군",
    "함양군",
    "합천군",
  ],
  제주특별자치도: ["서귀포시", "제주시"],
};

const PROVINCES = Object.keys(DISTRICTS_BY_PROVINCE);
const THEMES = [
  "문화관광축제",
  "문화예술축제",
  "지역특산물축제",
  "전통역사축제",
  "생태자연축제",
  "기타축제",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCurrentVisibleMonth() {
  const today = new Date();

  return {
    year: today.getFullYear(),
    month: today.getMonth(),
  };
}

function toDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join(".");
}

function formatDateRange(startDate, endDate) {
  if (!startDate) {
    return "";
  }

  const safeEndDate = endDate || startDate;
  return `${toDateKey(startDate)} - ${toDateKey(safeEndDate)}`;
}

function parseDateKey(value) {
  const match = value?.match(/(\d{4})\.(\d{2})\.(\d{2})/);

  if (!match) {
    return null;
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function parseDateRange(period) {
  const [startValue, endValue] = period?.split(" - ") || [];

  if (!startValue) {
    const fallbackStart = new Date(2026, 6, 1);
    const fallbackEnd = new Date(2026, 6, 10);
    return { startDate: fallbackStart, endDate: fallbackEnd };
  }

  const startDate = parseDateKey(startValue);
  let endDate = parseDateKey(endValue);

  if (!startDate) {
    const fallbackStart = new Date(2026, 6, 1);
    const fallbackEnd = new Date(2026, 6, 10);
    return { startDate: fallbackStart, endDate: fallbackEnd };
  }

  if (!endDate && endValue && startDate) {
    const shortDateMatch = endValue.match(/(\d{2})\.(\d{2})/);

    if (!shortDateMatch) {
      return { startDate, endDate: startDate };
    }

    const [, month, day] = shortDateMatch;
    endDate = new Date(startDate.getFullYear(), month - 1, day);
  }

  return {
    startDate,
    endDate: endDate || startDate,
  };
}

function isSameDate(firstDate, secondDate) {
  return (
    firstDate &&
    secondDate &&
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function isBetween(date, startDate, endDate) {
  if (!date || !startDate || !endDate) {
    return false;
  }

  const time = date.getTime();
  return time > startDate.getTime() && time < endDate.getTime();
}

function getCalendarDays(year, month) {
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const previousMonthLastDate = new Date(year, month, 0);
  const leadingCount = firstDate.getDay();
  const currentMonthDays = Array.from(
    { length: lastDate.getDate() },
    (_, index) => ({
      date: new Date(year, month, index + 1),
      day: index + 1,
      muted: false,
    }),
  );
  const leadingDays = Array.from({ length: leadingCount }, (_, index) => {
    const day = previousMonthLastDate.getDate() - leadingCount + index + 1;

    return {
      date: new Date(year, month - 1, day),
      day,
      muted: true,
    };
  });
  const trailingCount =
    (7 - ((leadingDays.length + currentMonthDays.length) % 7)) % 7;
  const trailingDays = Array.from({ length: trailingCount }, (_, index) => ({
    date: new Date(year, month + 1, index + 1),
    day: index + 1,
    muted: true,
  }));

  return [...leadingDays, ...currentMonthDays, ...trailingDays];
}

function getInitialValues(values) {
  const nextValues = {
    ...DEFAULT_VALUES,
    ...values,
  };

  if (values?.location && !values?.province && !values?.district) {
    const [province, district] = values.location.split(" ");
    nextValues.province = province || DEFAULT_VALUES.province;
    nextValues.district = district || DEFAULT_VALUES.district;
  }

  if (!DISTRICTS_BY_PROVINCE[nextValues.province]) {
    nextValues.province = DEFAULT_VALUES.province;
  }

  const provinceDistricts = DISTRICTS_BY_PROVINCE[nextValues.province];

  if (!provinceDistricts.includes(nextValues.district)) {
    nextValues.district = provinceDistricts[0];
  }

  nextValues.location = `${nextValues.province} ${nextValues.district}`.trim();
  return nextValues;
}

function FilterModal({
  isOpen = false,
  values,
  onApply,
  onChange,
  onClose,
  onReset,
}) {
  const [draftValues, setDraftValues] = useState(() =>
    getInitialValues(values),
  );
  const initialRange = useMemo(
    () => parseDateRange(getInitialValues(values).period),
    [values],
  );
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [visibleMonth, setVisibleMonth] = useState(getCurrentVisibleMonth);

  useEffect(() => {
    if (isOpen) {
      const nextValues = getInitialValues(values);
      const nextRange = parseDateRange(nextValues.period);

      setDraftValues(nextValues);
      setSelectedRange(nextRange);
      setVisibleMonth(getCurrentVisibleMonth());
    }
  }, [isOpen, values]);

  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth.year, visibleMonth.month),
    [visibleMonth],
  );
  const districtOptions =
    DISTRICTS_BY_PROVINCE[draftValues.province] ||
    DISTRICTS_BY_PROVINCE[DEFAULT_VALUES.province];

  if (!isOpen) {
    return null;
  }

  const updateDraft = (name, value) => {
    const nextValues = {
      ...draftValues,
      [name]: value,
    };

    if (name === "province") {
      nextValues.district = DISTRICTS_BY_PROVINCE[value]?.[0] || "";
    }

    if (name === "province" || name === "district") {
      nextValues.location =
        `${nextValues.province} ${nextValues.district}`.trim();
    }

    setDraftValues(nextValues);
    onChange?.(nextValues);
  };

  const handleMonthChange = (amount) => {
    setVisibleMonth((currentMonth) => {
      const nextDate = new Date(
        currentMonth.year,
        currentMonth.month + amount,
        1,
      );

      return {
        year: nextDate.getFullYear(),
        month: nextDate.getMonth(),
      };
    });
  };

  const handleDayClick = (date, muted) => {
    if (muted) {
      return;
    }

    const shouldStartNewRange =
      !selectedRange.startDate ||
      selectedRange.endDate ||
      date.getTime() < selectedRange.startDate.getTime();

    const nextRange = shouldStartNewRange
      ? { startDate: date, endDate: null }
      : { startDate: selectedRange.startDate, endDate: date };

    setSelectedRange(nextRange);
    updateDraft(
      "period",
      formatDateRange(nextRange.startDate, nextRange.endDate),
    );
  };

  const handleReset = () => {
    const defaultRange = parseDateRange(DEFAULT_VALUES.period);

    setDraftValues(DEFAULT_VALUES);
    setSelectedRange(defaultRange);
    setVisibleMonth({
      year: defaultRange.startDate.getFullYear(),
      month: defaultRange.startDate.getMonth(),
    });
    onChange?.(DEFAULT_VALUES);
    onReset?.();
  };

  const handleApply = () => {
    const appliedValues = {
      ...draftValues,
      location: `${draftValues.province} ${draftValues.district}`.trim(),
      period: formatDateRange(selectedRange.startDate, selectedRange.endDate),
    };

    onApply?.(appliedValues);
  };

  return (
    <ModalBackdrop aria-modal="true" onClick={onClose} role="dialog">
      <ModalPanel onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>상세 필터 설정</ModalTitle>
          <CloseButton
            aria-label="필터 모달 닫기"
            onClick={onClose}
            type="button"
          >
            <X size={22} strokeWidth={2.3} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <ContentGrid>
            <LeftColumn>
              <Section>
                <SectionHeader>
                  <MapPin size={20} strokeWidth={2.4} />
                  <SectionTitle>지역 선택</SectionTitle>
                </SectionHeader>

                <FieldStack>
                  <FieldLabel htmlFor="filter-province">광역시/도</FieldLabel>
                  <SelectWrap>
                    <Select
                      id="filter-province"
                      onChange={(event) =>
                        updateDraft("province", event.target.value)
                      }
                      value={draftValues.province}
                    >
                      {PROVINCES.map((province) => (
                        <option key={province}>{province}</option>
                      ))}
                    </Select>
                    <ChevronDown size={18} strokeWidth={2.4} />
                  </SelectWrap>

                  <FieldLabel htmlFor="filter-district">시/군/구</FieldLabel>
                  <SelectWrap>
                    <Select
                      id="filter-district"
                      onChange={(event) =>
                        updateDraft("district", event.target.value)
                      }
                      value={draftValues.district}
                    >
                      {districtOptions.map((district) => (
                        <option key={district}>{district}</option>
                      ))}
                    </Select>
                    <ChevronDown size={18} strokeWidth={2.4} />
                  </SelectWrap>
                </FieldStack>
              </Section>

              <Section>
                <SectionHeader>
                  <Sparkles size={20} strokeWidth={2.4} />
                  <SectionTitle>테마 선택</SectionTitle>
                </SectionHeader>

                <SelectWrap>
                  <Select
                    aria-label="테마 선택"
                    onChange={(event) =>
                      updateDraft("theme", event.target.value)
                    }
                    value={draftValues.theme}
                  >
                    <option value="">테마를 선택해주세요</option>
                    {THEMES.map((theme) => (
                      <option key={theme}>{theme}</option>
                    ))}
                  </Select>
                  <ChevronDown size={18} strokeWidth={2.4} />
                </SelectWrap>
              </Section>
            </LeftColumn>

            <Section>
              <SectionHeader>
                <CalendarDays size={20} strokeWidth={2.4} />
                <SectionTitle>기간 선택</SectionTitle>
              </SectionHeader>

              <CalendarPanel>
                <CalendarHeader>
                  <MonthLabel>
                    {visibleMonth.year}년 {visibleMonth.month + 1}월
                  </MonthLabel>
                  <MonthControls>
                    <MonthButton
                      aria-label="이전 달"
                      onClick={() => handleMonthChange(-1)}
                      type="button"
                    >
                      <ChevronLeft size={20} strokeWidth={2.4} />
                    </MonthButton>
                    <MonthButton
                      aria-label="다음 달"
                      onClick={() => handleMonthChange(1)}
                      type="button"
                    >
                      <ChevronRight size={20} strokeWidth={2.4} />
                    </MonthButton>
                  </MonthControls>
                </CalendarHeader>

                <WeekGrid>
                  {WEEKDAYS.map((weekday) => (
                    <div key={weekday}>{weekday}</div>
                  ))}
                </WeekGrid>

                <DayGrid>
                  {calendarDays.map(({ date, day, muted }) => {
                    const rangeStart =
                      !muted && isSameDate(date, selectedRange.startDate);
                    const rangeEnd =
                      !muted && isSameDate(date, selectedRange.endDate);
                    const singleDay = rangeStart && rangeEnd;
                    const selected =
                      !muted &&
                      isBetween(
                        date,
                        selectedRange.startDate,
                        selectedRange.endDate,
                      );

                    return (
                      <DayCell
                        $edge={rangeStart || rangeEnd}
                        $muted={muted}
                        $rangeEnd={rangeEnd}
                        $rangeStart={rangeStart}
                        $selected={selected}
                        $singleDay={singleDay}
                        disabled={muted}
                        key={toDateKey(date)}
                        onClick={() => handleDayClick(date, muted)}
                        type="button"
                      >
                        {day}
                      </DayCell>
                    );
                  })}
                </DayGrid>
              </CalendarPanel>
            </Section>
          </ContentGrid>
        </ModalContent>

        <ModalFooter>
          <ResetButton onClick={handleReset} type="button">
            초기화
          </ResetButton>
          <ApplyButton onClick={handleApply} type="button">
            필터 적용
          </ApplyButton>
        </ModalFooter>
      </ModalPanel>
    </ModalBackdrop>
  );
}

export default FilterModal;
