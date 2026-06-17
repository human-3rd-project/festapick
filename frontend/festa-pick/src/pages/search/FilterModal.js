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
import AxiosApi from "../../api/AxiosApi";
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
  province: "",
  district: "",
  location: "",
  period: "",
  theme: "",
  ldongRegnCd: "",
  ldongSignguCd: "",
  lclsSystm: "",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 추가: ApiResponse(data 래핑)와 일반 axios 응답을 모두 안전하게 꺼내기 위한 헬퍼입니다.
const getResponseData = (response) => response?.data?.data ?? response?.data ?? null;

// 추가: 값이 배열인지 확인해 필터 API가 null을 내려줘도 빈 목록으로 처리합니다.
const getSafeArray = (value) => (Array.isArray(value) ? value : []);

// 추가: 백엔드 LegalDongCodes 응답을 화면에서 사용할 지역 option 형태로 정규화합니다.
const normalizeRegionOption = (region) => {
  const province = region?.sidoName || region?.province || "";
  const district = region?.sigunguName || region?.district || "";

  if (!province || !district) {
    return null;
  }

  return {
    province,
    district,
    fullName: region?.fullName || `${province} ${district}`,
    ldongRegnCd: region?.ldongRegnCd || "",
    ldongSignguCd: region?.ldongSignguCd || "",
  };
};

// 추가: 지역 option 배열을 province 기준으로 묶어 select 옵션을 만들기 쉽게 합니다.
const groupRegionsByProvince = (regions) =>
  regions.reduce((groups, region) => {
    if (!groups[region.province]) {
      groups[region.province] = [];
    }

    groups[region.province].push(region);
    return groups;
  }, {});

// 추가: 백엔드 FestivalCategoryCodes 응답을 표시명과 검색 코드가 있는 option으로 정규화합니다.
const normalizeThemeOption = (theme) => {
  const label = theme?.sclsName || theme?.mclsName || theme?.lclsName || theme?.name || "";
  const code = theme?.sclsCode || theme?.mclsCode || theme?.lclsCode || theme?.code || "";

  if (!label) {
    return null;
  }

  return {
    label,
    value: code || label,
    lclsSystm: code,
  };
};

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
  // 수정: "2026.6.1"처럼 한 자리 월/일도 테스트 값으로 들어올 수 있어 허용합니다.
  const match = value?.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);

  if (!match) {
    return null;
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function parseDateRange(period) {
  const [startValue, endValue] = period?.split(" - ") || [];

  if (!startValue) {
    return { startDate: null, endDate: null };
  }

  const startDate = parseDateKey(startValue);
  let endDate = parseDateKey(endValue);

  if (!startDate) {
    return { startDate: null, endDate: null };
  }

  if (!endDate && endValue && startDate) {
    const shortDateMatch = endValue.match(/(\d{1,2})\.(\d{1,2})/);

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
    nextValues.province = province || "";
    nextValues.district = district || "";
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
  // 추가: API 필터 옵션입니다. 응답이 비어 있거나 실패하면 빈 목록으로 표시합니다.
  const [regionOptions, setRegionOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [filterLoadMessage, setFilterLoadMessage] = useState("");
  const [draftValues, setDraftValues] = useState(() =>
    getInitialValues(values),
  );
  const initialRange = useMemo(
    () => parseDateRange(getInitialValues(values).period),
    [values],
  );
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [visibleMonth, setVisibleMonth] = useState(getCurrentVisibleMonth);

  // 추가: 모달이 열릴 때 지역/테마 필터 API를 조회합니다. 실패 시 빈 옵션 상태를 표시합니다.
  useEffect(() => {
    let isMounted = true;

    if (!isOpen) {
      return undefined;
    }

    const fetchFilterOptions = async () => {
      try {
        const [regionResponse, themeResponse] = await Promise.all([
          AxiosApi.getFestivalRegionFilters(),
          AxiosApi.getFestivalThemeFilters(),
        ]);
        const nextRegionOptions = getSafeArray(getResponseData(regionResponse))
          .map(normalizeRegionOption)
          .filter(Boolean);
        const nextThemeOptions = getSafeArray(getResponseData(themeResponse))
          .map(normalizeThemeOption)
          .filter(Boolean);

        if (isMounted) {
          setRegionOptions(
            nextRegionOptions.length > 0
              ? nextRegionOptions
              : [],
          );
          setThemeOptions(
            nextThemeOptions.length > 0
              ? nextThemeOptions
              : [],
          );
          setFilterLoadMessage(
            nextRegionOptions.length === 0 && nextThemeOptions.length === 0
              ? "필터 API 데이터가 없습니다."
              : "",
          );
        }
      } catch (error) {
        if (isMounted) {
          console.error("FilterModal filter option load error:", error);
          setRegionOptions([]);
          setThemeOptions([]);
          setFilterLoadMessage("필터 옵션을 불러오지 못했습니다.");
        }
      }
    };

    fetchFilterOptions();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

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
  // 지역 select 역할: API 옵션을 province별로 묶고, 비어 있으면 기존 정적 목록으로 대체합니다.
  const regionsByProvince = useMemo(
    () => groupRegionsByProvince(regionOptions),
    [regionOptions],
  );
  const provinceOptions = useMemo(() => {
    const provinces = Object.keys(regionsByProvince);
    return provinces;
  }, [regionsByProvince]);
  const districtOptions =
    regionsByProvince[draftValues.province] || [];

  if (!isOpen) {
    return null;
  }

  const updateDraft = (name, value) => {
    const nextValues = {
      ...draftValues,
      [name]: value,
    };

    if (name === "province") {
      const firstDistrict = regionsByProvince[value]?.[0];
      nextValues.district = firstDistrict?.district || "";
      nextValues.ldongRegnCd = firstDistrict?.ldongRegnCd || "";
      nextValues.ldongSignguCd = firstDistrict?.ldongSignguCd || "";
    }

    if (name === "district") {
      const selectedRegion = districtOptions.find(
        (region) => region.district === value,
      );
      nextValues.ldongRegnCd = selectedRegion?.ldongRegnCd || "";
      nextValues.ldongSignguCd = selectedRegion?.ldongSignguCd || "";
    }

    if (name === "theme") {
      const selectedTheme = themeOptions.find((theme) => theme.label === value);
      nextValues.lclsSystm = selectedTheme?.lclsSystm || "";
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
    setVisibleMonth(getCurrentVisibleMonth());
    onChange?.(DEFAULT_VALUES);
    onReset?.();
  };

  const handleApply = () => {
    const selectedRegion = districtOptions.find(
      (region) => region.district === draftValues.district,
    );
    const selectedTheme = themeOptions.find(
      (theme) => theme.label === draftValues.theme,
    );
    const appliedValues = {
      ...draftValues,
      location: `${draftValues.province} ${draftValues.district}`.trim(),
      period: formatDateRange(selectedRange.startDate, selectedRange.endDate),
      ldongRegnCd: draftValues.ldongRegnCd || selectedRegion?.ldongRegnCd || "",
      ldongSignguCd:
        draftValues.ldongSignguCd || selectedRegion?.ldongSignguCd || "",
      lclsSystm: draftValues.lclsSystm || selectedTheme?.lclsSystm || "",
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
          {/* 추가: API/DB에 필터 데이터가 없거나 호출 실패한 상태를 표시합니다. */}
          {filterLoadMessage && (
            <p
              role="status"
              style={{
                color: "#ffb690",
                fontSize: "13px",
                fontWeight: 700,
                lineHeight: "20px",
                margin: "0 0 16px",
              }}
            >
              {filterLoadMessage}
            </p>
          )}

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
                      disabled={provinceOptions.length === 0}
                      id="filter-province"
                      onChange={(event) =>
                        updateDraft("province", event.target.value)
                      }
                      value={draftValues.province}
                    >
                      <option value="">지역 데이터 없음</option>
                      {provinceOptions.map((province) => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </Select>
                    <ChevronDown size={18} strokeWidth={2.4} />
                  </SelectWrap>

                  <FieldLabel htmlFor="filter-district">시/군/구</FieldLabel>
                  <SelectWrap>
                    <Select
                      disabled={districtOptions.length === 0}
                      id="filter-district"
                      onChange={(event) =>
                        updateDraft("district", event.target.value)
                      }
                      value={draftValues.district}
                    >
                      <option value="">시/군/구 데이터 없음</option>
                      {districtOptions.map((district) => (
                        <option
                          key={`${district.province}-${district.district}-${district.ldongSignguCd}`}
                          value={district.district}
                        >
                          {district.district}
                        </option>
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
                    disabled={themeOptions.length === 0}
                    onChange={(event) =>
                      updateDraft("theme", event.target.value)
                    }
                    value={draftValues.theme}
                  >
                    <option value="">
                      {themeOptions.length === 0 ? "테마 데이터 없음" : "테마를 선택해주세요"}
                    </option>
                    {themeOptions.map((theme) => (
                      <option key={`${theme.label}-${theme.value}`} value={theme.label}>
                        {theme.label}
                      </option>
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
