import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import AxiosApi from "../../../api/AxiosApi";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageRecordStyle";

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const fallbackImage =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80";

// ApiResponse<T>와 axios response 양쪽 형태에서 실제 data만 꺼냅니다.
const getResponseData = (response) => response?.data?.data ?? response?.data;

const createDateKey = (year, monthIndex, day) => {
  const month = String(monthIndex + 1).padStart(2, "0");
  const date = String(day).padStart(2, "0");

  return `${year}-${month}-${date}`;
};

const formatDisplayDate = (dateKey) => {
  if (!dateKey) {
    return "";
  }

  const [year, month, day] = dateKey.split("-");

  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

// 현재 보고 있는 달의 시작일과 종료일을 LocalDate 문자열로 만듭니다.
const getMonthBounds = (date) => {
  const year = date.getFullYear();
  const monthIndex = date.getMonth();

  return {
    startDate: createDateKey(year, monthIndex, 1),
    endDate: createDateKey(year, monthIndex, new Date(year, monthIndex + 1, 0).getDate()),
  };
};

// VisitHistoryResDto를 기존 기록 카드 UI에서 쓰는 필드명으로 변환합니다.
const mapVisitHistory = (record) => ({
  id: record.visitHistoryId,
  date: record.visitDate,
  title: record.historyTitle || "제목 없는 기록",
  place: "방문 기록",
  category: "기록",
  image: record.thumbnailUrl || record.imageUrls?.[0] || fallbackImage,
  imageUrls: record.imageUrls || [],
  content: record.memo || "기록 내용이 없습니다.",
});

function MyPageRecord() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [records, setRecords] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [draft, setDraft] = useState({
    title: "",
    date: "",
    imagePreview: "",
    imageUrls: [],
    content: "",
  });

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const lastDate = new Date(year, monthIndex + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, (_, index) => ({
      key: `blank-${index}`,
      day: null,
    }));
    const days = Array.from({ length: lastDate }, (_, index) => ({
      key: createDateKey(year, monthIndex, index + 1),
      day: index + 1,
    }));

    return [...blanks, ...days];
  }, [monthIndex, year]);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // 방문 기록 목록 API는 startDate/endDate 쿼리 파라미터가 필수입니다.
      const { startDate, endDate } = getMonthBounds(viewDate);
      const response = await AxiosApi.getVisitHistoryList(startDate, endDate);
      const data = getResponseData(response) || [];

      setRecords(data.map(mapVisitHistory));
    } catch (error) {
      setRecords([]);
      setErrorMessage(
        error.response?.data?.message || "방문 기록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [viewDate]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const recordDates = useMemo(
    () => new Set(records.map((record) => record.date)),
    [records],
  );

  const selectedRecords = useMemo(
    () => records.filter((record) => record.date === selectedDate),
    [records, selectedDate],
  );

  const moveMonth = (offset) => {
    setViewDate(new Date(year, monthIndex + offset, 1));
    setSelectedDate("");
    setIsAdding(false);
    setEditingId(null);
  };

  const selectDate = (dateKey) => {
    setSelectedDate(dateKey);
    setIsAdding(false);
    setEditingId(null);
    setDraft({
      title: "",
      date: dateKey,
      imagePreview: "",
      imageUrls: [],
      content: "",
    });
  };

  const startAddRecord = () => {
    setIsAdding(true);
    setEditingId(null);
    setDraft({
      title: "",
      date: selectedDate,
      imagePreview: "",
      imageUrls: [],
      content: "",
    });
  };

  const startEditRecord = (record) => {
    setIsAdding(false);
    setEditingId(record.id);
    setDraft({
      title: record.title,
      date: record.date,
      imagePreview: record.image,
      imageUrls: record.imageUrls || [],
      content: record.content,
    });
  };

  const cancelDraft = () => {
    setIsAdding(false);
    setEditingId(null);
    setDraft({
      title: "",
      date: selectedDate,
      imagePreview: "",
      imageUrls: [],
      content: "",
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Firebase 업로드가 붙기 전까지는 파일을 미리보기로만 보관합니다.
      setDraft((current) => ({ ...current, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveRecord = async () => {
    const title = draft.title.trim();
    const recordDate = draft.date || selectedDate;

    if (!title || !recordDate) {
      return;
    }

    // 백엔드는 Firebase 업로드가 끝난 이미지 URL 배열을 imageUrls로 받습니다.
    const payload = {
      historyTitle: title,
      visitDate: recordDate,
      memo: draft.content.trim(),
      imageUrls: draft.imageUrls,
    };

    try {
      // editingId가 있으면 수정, 없으면 신규 방문 기록 생성으로 처리합니다.
      if (editingId) {
        await AxiosApi.updateVisitHistory(editingId, payload);
      } else {
        await AxiosApi.createVisitHistory(payload);
      }

      setSelectedDate(recordDate);
      setViewDate(new Date(`${recordDate}T00:00:00`));
      cancelDraft();
      await loadRecords();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "방문 기록을 저장하지 못했습니다.",
      );
    }
  };

  const deleteRecord = async (recordId) => {
    try {
      // 삭제 후 현재 월 데이터를 다시 조회해 캘린더 표시 상태를 맞춥니다.
      await AxiosApi.deleteVisitHistory(recordId);
      setEditingId(null);
      await loadRecords();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "방문 기록을 삭제하지 못했습니다.",
      );
    }
  };

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/record" />

        <S.Content>
          <S.TitleRow>
            <S.Title>나의 기록</S.Title>
          </S.TitleRow>
          {errorMessage && <S.ModalDescription>{errorMessage}</S.ModalDescription>}
          {isLoading && <S.ModalDescription>방문 기록을 불러오는 중입니다.</S.ModalDescription>}

          <S.RecordLayout $hasSelectedDate={Boolean(selectedDate)}>
            <S.CalendarPanel>
              <S.CalendarHeader>
                <S.MonthTitle>
                  {year}년 {monthIndex + 1}월
                </S.MonthTitle>
                <S.MonthControls>
                  <S.MonthButton
                    type="button"
                    onClick={() => moveMonth(-1)}
                    aria-label="이전 달"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </S.MonthButton>
                  <S.MonthButton
                    type="button"
                    onClick={() => moveMonth(1)}
                    aria-label="다음 달"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </S.MonthButton>
                </S.MonthControls>
              </S.CalendarHeader>

              <S.WeekGrid>
                {weekDays.map((day) => (
                  <S.WeekDay key={day}>{day}</S.WeekDay>
                ))}
              </S.WeekGrid>

              <S.DayGrid>
                {calendarDays.map((calendarDay) =>
                  calendarDay.day ? (
                    <S.DayButton
                      key={calendarDay.key}
                      type="button"
                      $active={selectedDate === calendarDay.key}
                      $hasRecord={recordDates.has(calendarDay.key)}
                      onClick={() => selectDate(calendarDay.key)}
                    >
                      <span>{calendarDay.day}</span>
                    </S.DayButton>
                  ) : (
                    <S.EmptyDay key={calendarDay.key} />
                  ),
                )}
              </S.DayGrid>
            </S.CalendarPanel>

            {selectedDate && (
              <S.SidePanel>
                {selectedRecords.length > 0 && (
                  <S.RecordStack>
                    {selectedRecords.map((record) => (
                      <S.DetailCard key={record.id}>
                        <S.DetailImage src={record.image} alt="" />
                        <S.CategoryBadge>{record.category}</S.CategoryBadge>
                        <S.DetailBody>
                          <S.DetailTitle>{record.title}</S.DetailTitle>
                          <S.MetaItem>
                            <CalendarDays size={14} aria-hidden="true" />
                            {formatDisplayDate(record.date)}
                          </S.MetaItem>
                          <S.MetaItem>
                            <MapPin size={14} aria-hidden="true" />
                            {record.place}
                          </S.MetaItem>
                          <S.DetailText>{record.content}</S.DetailText>
                          <S.CardActions>
                            <S.EditButton
                              type="button"
                              onClick={() => startEditRecord(record)}
                            >
                              <Pencil size={14} aria-hidden="true" />
                              기록 수정
                            </S.EditButton>
                            <S.DeleteButton
                              type="button"
                              onClick={() => deleteRecord(record.id)}
                              aria-label="기록 삭제"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </S.DeleteButton>
                          </S.CardActions>
                        </S.DetailBody>
                      </S.DetailCard>
                    ))}
                  </S.RecordStack>
                )}

                {!isAdding && !editingId && (
                  <S.AddRecordButton type="button" onClick={startAddRecord}>
                    <S.AddIcon aria-hidden="true">
                      <Plus size={20} />
                    </S.AddIcon>
                    <span>새로운 기록 추가</span>
                  </S.AddRecordButton>
                )}
              </S.SidePanel>
            )}
          </S.RecordLayout>

          {(isAdding || editingId) && (
            <S.ModalOverlay role="presentation">
              <S.ModalPanel
                role="dialog"
                aria-modal="true"
                aria-labelledby="record-modal-title"
              >
                <S.ModalHeader>
                  <div>
                    <S.ModalTitle id="record-modal-title">
                      {editingId ? "기록 수정" : "새로운 기록"}
                    </S.ModalTitle>
                    <S.ModalDescription>
                      페스티벌에서의 소중한 순간을 기록해보세요.
                    </S.ModalDescription>
                  </div>
                  <S.ModalCloseButton
                    type="button"
                    onClick={cancelDraft}
                    aria-label="모달 닫기"
                  >
                    <X size={18} aria-hidden="true" />
                  </S.ModalCloseButton>
                </S.ModalHeader>

                <S.ModalBody>
                  <S.FieldGroup>
                    <S.FormLabel>사진 업로드</S.FormLabel>
                    <S.UploadBox>
                      <S.FileInput
                        id="record-image"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleImageUpload}
                      />
                      <S.UploadLabel htmlFor="record-image">
                        {draft.imagePreview ? (
                          <S.UploadPreview src={draft.imagePreview} alt="" />
                        ) : (
                          <>
                            <ImagePlus size={27} aria-hidden="true" />
                            <S.UploadText>
                              클릭하여 이미지를 추가하세요
                            </S.UploadText>
                            <S.UploadHint>JPG, PNG (최대 5MB)</S.UploadHint>
                          </>
                        )}
                      </S.UploadLabel>
                    </S.UploadBox>
                  </S.FieldGroup>

                  <S.FieldGroup>
                    <S.FormLabel htmlFor="record-title">제목</S.FormLabel>
                    <S.FormInput
                      id="record-title"
                      value={draft.title}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      placeholder="어떤 페스티벌이었나요?"
                    />
                  </S.FieldGroup>

                  <S.FieldGroup>
                    <S.FormLabel htmlFor="record-date">방문일자</S.FormLabel>
                    <S.FormInput
                      id="record-date"
                      type="date"
                      value={draft.date}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          date: event.target.value,
                        }))
                      }
                    />
                  </S.FieldGroup>

                  <S.FieldGroup>
                    <S.FormLabel htmlFor="record-content">내용</S.FormLabel>
                    <S.FormTextarea
                      id="record-content"
                      value={draft.content}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          content: event.target.value,
                        }))
                      }
                      placeholder="기억에 남는 순간을 자유롭게 적어주세요."
                    />
                  </S.FieldGroup>
                </S.ModalBody>

                <S.ModalFooter>
                  <S.GhostButton type="button" onClick={cancelDraft}>
                    취소
                  </S.GhostButton>
                  <S.SaveButton type="button" onClick={saveRecord}>
                    <Save size={15} aria-hidden="true" />
                    저장하기
                  </S.SaveButton>
                </S.ModalFooter>
              </S.ModalPanel>
            </S.ModalOverlay>
          )}
        </S.Content>
      </S.Container>
    </S.Page>
  );
}

export default MyPageRecord;
