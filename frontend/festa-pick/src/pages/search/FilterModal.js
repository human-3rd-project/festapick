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
  period: "2024.10.13 - 10.19",
  theme: "",
};

const PROVINCES = ["서울특별시", "부산광역시", "경기도"];
const DISTRICTS = ["강남구", "서초구", "마포구"];
const THEMES = [
  "뮤직 & 페스티벌",
  "푸드 & 미식",
  "문화 & 예술",
  "전통 & 역사",
  "전시회",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    const fallbackStart = new Date(2024, 9, 13);
    const fallbackEnd = new Date(2024, 9, 19);
    return { startDate: fallbackStart, endDate: fallbackEnd };
  }

  const startDate = parseDateKey(startValue);
  let endDate = parseDateKey(endValue);

  if (!startDate) {
    const fallbackStart = new Date(2024, 9, 13);
    const fallbackEnd = new Date(2024, 9, 19);
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
  const currentMonthDays = Array.from({ length: lastDate.getDate() }, (_, index) => ({
    date: new Date(year, month, index + 1),
    day: index + 1,
    muted: false,
  }));
  const leadingDays = Array.from({ length: leadingCount }, (_, index) => {
    const day = previousMonthLastDate.getDate() - leadingCount + index + 1;

    return {
      date: new Date(year, month - 1, day),
      day,
      muted: true,
    };
  });
  const trailingCount = (7 - ((leadingDays.length + currentMonthDays.length) % 7)) % 7;
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
  const [draftValues, setDraftValues] = useState(() => getInitialValues(values));
  const initialRange = useMemo(
    () => parseDateRange(getInitialValues(values).period),
    [values],
  );
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [visibleMonth, setVisibleMonth] = useState(() => ({
    year: initialRange.startDate.getFullYear(),
    month: initialRange.startDate.getMonth(),
  }));

  useEffect(() => {
    if (isOpen) {
      const nextValues = getInitialValues(values);
      const nextRange = parseDateRange(nextValues.period);

      setDraftValues(nextValues);
      setSelectedRange(nextRange);
      setVisibleMonth({
        year: nextRange.startDate.getFullYear(),
        month: nextRange.startDate.getMonth(),
      });
    }
  }, [isOpen, values]);

  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth.year, visibleMonth.month),
    [visibleMonth],
  );

  if (!isOpen) {
    return null;
  }

  const updateDraft = (name, value) => {
    const nextValues = {
      ...draftValues,
      [name]: value,
    };

    if (name === "province" || name === "district") {
      nextValues.location = `${nextValues.province} ${nextValues.district}`.trim();
    }

    setDraftValues(nextValues);
    onChange?.(nextValues);
  };

  const handleMonthChange = (amount) => {
    setVisibleMonth((currentMonth) => {
      const nextDate = new Date(currentMonth.year, currentMonth.month + amount, 1);

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
    updateDraft("period", formatDateRange(nextRange.startDate, nextRange.endDate));
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
    <ModalBackdrop
      aria-modal="true"
      onClick={onClose}
      role="dialog"
    >
      <ModalPanel onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>상세 필터 설정</ModalTitle>
          <CloseButton aria-label="필터 모달 닫기" onClick={onClose} type="button">
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
                      onChange={(event) => updateDraft("province", event.target.value)}
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
                      onChange={(event) => updateDraft("district", event.target.value)}
                      value={draftValues.district}
                    >
                      {DISTRICTS.map((district) => (
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
                    onChange={(event) => updateDraft("theme", event.target.value)}
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
                    const rangeStart = !muted && isSameDate(date, selectedRange.startDate);
                    const rangeEnd = !muted && isSameDate(date, selectedRange.endDate);
                    const singleDay = rangeStart && rangeEnd;
                    const selected = !muted && isBetween(
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
