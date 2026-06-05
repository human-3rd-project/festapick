import React, { useMemo, useState } from "react";
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
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageRecordStyle";

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const initialRecords = [
  {
    id: 1,
    date: "2024-10-12",
    title: "서울 재즈 페스티벌 방문기",
    place: "서울 올림픽공원",
    category: "음악",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    content:
      "분위기가 정말 환상적이었어요. 드디어 고대하고 있던 라인업을 직접 보게 되다니... 밤공기는 시원했고 무대 조명은 오래 기억에 남을 것 같아요.",
  },
  {
    id: 2,
    date: "2024-10-04",
    title: "한강 야간 버스킹",
    place: "서울 여의도 한강공원",
    category: "야간",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    content:
      "강바람이 선선했고 작은 무대의 라이브 사운드가 좋아서 오래 머물렀다.",
  },
  {
    id: 3,
    date: "2024-10-25",
    title: "가을 미식 축제",
    place: "서울 성수동",
    category: "미식",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    content: "부스 동선은 조금 복잡했지만 디저트와 로컬 푸드 구성이 알찼다.",
  },
];

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

function MyPageRecord() {
  const [viewDate, setViewDate] = useState(new Date(2024, 9, 1));
  const [selectedDate, setSelectedDate] = useState("");
  const [records, setRecords] = useState(initialRecords);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    title: "",
    date: "",
    image: "",
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
    setDraft({ title: "", date: dateKey, image: "", content: "" });
  };

  const startAddRecord = () => {
    setIsAdding(true);
    setEditingId(null);
    setDraft({ title: "", date: selectedDate, image: "", content: "" });
  };

  const startEditRecord = (record) => {
    setIsAdding(false);
    setEditingId(record.id);
    setDraft({
      title: record.title,
      date: record.date,
      image: record.image,
      content: record.content,
    });
  };

  const cancelDraft = () => {
    setIsAdding(false);
    setEditingId(null);
    setDraft({ title: "", date: selectedDate, image: "", content: "" });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDraft((current) => ({ ...current, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveRecord = () => {
    const title = draft.title.trim();
    const recordDate = draft.date || selectedDate;

    if (!title || !recordDate) {
      return;
    }

    if (editingId) {
      setRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.id === editingId
            ? {
                ...record,
                title,
                date: recordDate,
                image: draft.image || record.image,
                content: draft.content.trim() || "기록 내용이 없습니다.",
              }
            : record,
        ),
      );
    } else {
      setRecords((currentRecords) => [
        ...currentRecords,
        {
          id: Date.now(),
          date: recordDate,
          title,
          place: "장소 미입력",
          category: "기록",
          image:
            draft.image ||
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
          content: draft.content.trim() || "기록 내용이 없습니다.",
        },
      ]);
    }

    setSelectedDate(recordDate);
    setViewDate(new Date(`${recordDate}T00:00:00`));
    cancelDraft();
  };

  const deleteRecord = (recordId) => {
    setRecords((currentRecords) =>
      currentRecords.filter((record) => record.id !== recordId),
    );
    setEditingId(null);
  };

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/record" />

        <S.Content>
          <S.TitleRow>
            <S.Title>나의 기록</S.Title>
          </S.TitleRow>

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
                        {draft.image ? (
                          <S.UploadPreview src={draft.image} alt="" />
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
