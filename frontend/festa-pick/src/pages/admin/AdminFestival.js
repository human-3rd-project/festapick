import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { MapPinOff, PartyPopper, Search, Trash2 } from "lucide-react";
import AdminNav from "./AdminNav";
import AdminPageNation from "./AdminPageNation";
import {
  ActionCell,
  ConfirmDelete,
  ContentArea,
  EmptyBadge,
  EmptyCopy,
  EmptyGlow,
  EmptyIconCard,
  EmptyState,
  EmptyTitle,
  FestivalImage,
  FestivalInfo,
  FestivalMeta,
  FestivalName,
  HeaderActions,
  HeaderCopy,
  MainCanvas,
  PageFrame,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PreviewButton,
  SearchBox,
  SearchIcon,
  SearchInput,
  StatPill,
  StatusBadge,
  Table,
  TableCard,
  TableScroll,
} from "./AdminFestivalCss";

const PAGE_SIZE = 10;

function getDeletePopoverPosition(target) {
  const rect = target.getBoundingClientRect();
  const width = 128;
  const height = 44;
  const gap = 8;
  const left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12));
  const bottomTop = rect.bottom + gap;
  const top =
    bottomTop + height > window.innerHeight - 12 ? rect.top - height - gap : bottomTop;

  return { left, top };
}

const sampleFestivals = [
  {
    id: 1,
    name: "일렉트릭 드림스 나이트",
    category: "음악 및 예술",
    location: "서울",
    startDate: "2024-10-12",
    endDate: "2024-10-14",
    status: "active",
    statusLabel: "진행 중",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDpVdhtYZkPtzNZnoqYjYpkbgouJQyPmEwyu5jENeNmgDjVgWzIx4WXjiX42FaZAxWA6ZnzzpTvS3FmhzMIHD3OK0dDzKHFivx7m3fgvwoUdJFfIedjO_eB-9mhry9anWaHfweEG7x2ZcegWIrXolSqWpAkdiQqQMnbIhbAv4wKYBeXya1I3NHsxfsJ4RxNVROfMKChrGtaXxduafkhFD5SbQ-rWtIkc6IXPCFt75ydSKgm2lYcxfiJjCP0CROidcyKdilh0bYRR3-",
  },
  {
    id: 2,
    name: "미드나잇 재즈 하모니",
    category: "라이브 공연",
    location: "부산",
    startDate: "2024-09-28",
    endDate: "2024-09-30",
    status: "ended",
    statusLabel: "종료됨",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATm3kTy37xVWxXiOPp1Wy0xkZv0yNWsoXrotzQCmxwkhHlvpQaCELz10D470b6--dSpj6_QzVvo8Bmg3GPhDfK9i_umF04LNzxeN48BdGL0u1PlpKcKTdpJ5TutNdBRptM0tuZj_Zc4gfX8x1jPokwowydLIH8MwWHgof_a7bw_3_i5uqu16xZa_FDLzAQ9-DtLEFT6DA8NHKFcqrQivFg6-MyruLY9mZGvFE1uXByGjRMHCouOqQZZxjuEP5NrpvC8JokRNc4TPak",
  },
  {
    id: 3,
    name: "네온 시티 아트 갈라",
    category: "전시회",
    location: "인천",
    startDate: "2024-10-05",
    endDate: "2024-10-10",
    status: "active",
    statusLabel: "진행 중",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPbipqFLyBFy10Vw5kt-AXXCeLYHlYwMN2BY9x6uEao0bJwBRqBx-v0MA2ElQBmvtOAO1iGmEaxef7p6QMexVvsMp4LwFI1PPn3Rr5sqga56cgssFYEUfF71UuimsAQad17U5i_fEA_88cX2TZmTY8bJm1cenbe5X4qXK_N08RVNv-5lbHXBbhouXvwJ1TJ4_7SIJQzUuGNAg861Pt8p9RSerROC9914MJCNcK3dvD5dGbEwYso93uMGIthmTimLbcAlTVFWoelyTN",
  },
];

function getFestivalKey(festival, index) {
  return festival.id || festival.festivalId || festival.uuid || index;
}

function getFestivalName(festival) {
  return festival.name || festival.title || festival.festivalName || "이름 없는 축제";
}

function getFestivalCategory(festival) {
  return festival.category || festival.genre || festival.type || "카테고리 없음";
}

function getFestivalLocation(festival) {
  return festival.location || festival.region || festival.address || "위치 없음";
}

function getFestivalImage(festival) {
  return festival.image || festival.thumbnail || festival.poster || festival.imageUrl || "";
}

function getFestivalStatus(festival) {
  const status = festival.status || festival.state || "";

  if (festival.statusLabel) {
    return festival.statusLabel;
  }

  if (status === "active" || status === "ongoing") {
    return "진행 중";
  }

  if (status === "ended" || status === "closed") {
    return "종료됨";
  }

  if (status === "scheduled" || status === "upcoming") {
    return "예정";
  }

  return status || "상태 없음";
}

function isActiveFestival(festival) {
  const status = festival.status || festival.state || "";
  const label = getFestivalStatus(festival);

  return status === "active" || status === "ongoing" || label === "진행 중";
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function formatPeriod(festival) {
  const start = formatDate(festival.startDate || festival.startedAt || festival.startAt);
  const end = formatDate(festival.endDate || festival.endedAt || festival.endAt);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end || festival.period || "-";
}

function AdminFestival({
  currentPage = 1,
  festivals = [],
  onDeleteFestival,
  onPageChange,
  onSearchChange,
  totalItems,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);
  // 임시 확인 버튼: 축제 데이터 있음/없음 디자인 확인용, 실제 기능 연결 시 제거
  const [showSampleFestivals, setShowSampleFestivals] = useState(false);
  // 임시 확인 버튼 끝

  // 임시 확인 버튼: 축제 데이터 있음/없음 디자인 확인용, 실제 기능 연결 시 제거
  const displayFestivals = showSampleFestivals ? sampleFestivals : festivals;
  // 임시 확인 버튼 끝

  const visibleFestivals = useMemo(
    () =>
      displayFestivals.filter(
        (festival, index) => !deletedIds.includes(getFestivalKey(festival, index)),
      ),
    [deletedIds, displayFestivals],
  );

  const filteredFestivals = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return visibleFestivals;
    }

    return visibleFestivals.filter((festival) => {
      const searchableText = [
        getFestivalName(festival),
        getFestivalCategory(festival),
        getFestivalLocation(festival),
        getFestivalStatus(festival),
        festival.period,
        festival.startDate,
        festival.endDate,
        festival.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [searchTerm, visibleFestivals]);

  const hasFestivals = filteredFestivals.length > 0;
  const totalCount = totalItems || visibleFestivals.length;

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const confirmDelete = (festival, index) => {
    if (onDeleteFestival) {
      onDeleteFestival(festival);
    } else {
      setDeletedIds((prev) => [...prev, getFestivalKey(festival, index)]);
    }

    setDeleteTarget(null);
  };

  const toggleDeleteTarget = (id, target) => {
    setDeleteTarget((prev) => {
      if (prev?.id === id) {
        return null;
      }

      return {
        id,
        ...getDeletePopoverPosition(target),
      };
    });
  };

  return (
    <PageFrame>
      <AdminNav />

      <MainCanvas>
        <ContentArea $isEmpty={!hasFestivals}>
          <PageHeader>
            <HeaderCopy>
              <PageTitle>축제 관리</PageTitle>
              <PageSubtitle>
                세계에서 가장 생생한 축제 경험을 검토, 업데이트 및 구성하세요.
              </PageSubtitle>
            </HeaderCopy>

            <HeaderActions>
              <SearchBox>
                <SearchIcon aria-hidden="true">
                  <Search />
                </SearchIcon>
                <SearchInput
                  type="search"
                  placeholder="축제 검색..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </SearchBox>

              <StatPill>
                <strong>{totalCount.toLocaleString("ko-KR")}</strong>
                <span>총 축제 수</span>
              </StatPill>

              {/* 임시 확인 버튼: 축제 데이터 있음/없음 디자인 확인용, 실제 기능 연결 시 제거 */}
              <PreviewButton
                type="button"
                onClick={() => setShowSampleFestivals((prev) => !prev)}
              >
                {showSampleFestivals ? "빈 상태 보기" : "목록 상태 보기"}
              </PreviewButton>
              {/* 임시 확인 버튼 끝 */}
            </HeaderActions>
          </PageHeader>

          {hasFestivals ? (
            <TableCard>
              <TableScroll>
                <Table>
                  <thead>
                    <tr>
                      <th>축제 이름</th>
                      <th>위치</th>
                      <th>기간</th>
                      <th>상태</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFestivals.map((festival, index) => {
                      const key = getFestivalKey(festival, index);
                      const festivalName = getFestivalName(festival);

                      return (
                        <tr key={key}>
                          <td>
                            <FestivalInfo>
                              <FestivalImage>
                                {getFestivalImage(festival) ? (
                                  <img src={getFestivalImage(festival)} alt={festivalName} />
                                ) : (
                                  <PartyPopper aria-hidden="true" />
                                )}
                              </FestivalImage>
                              <div>
                                <FestivalName>{festivalName}</FestivalName>
                                <FestivalMeta>{getFestivalCategory(festival)}</FestivalMeta>
                              </div>
                            </FestivalInfo>
                          </td>
                          <td>{getFestivalLocation(festival)}</td>
                          <td>{formatPeriod(festival)}</td>
                          <td>
                            <StatusBadge $active={isActiveFestival(festival)}>
                              <span aria-hidden="true" />
                              {getFestivalStatus(festival)}
                            </StatusBadge>
                          </td>
                          <td>
                            <ActionCell>
                              <button
                                type="button"
                                aria-label={`${festivalName} 축제 삭제`}
                                onClick={(event) => toggleDeleteTarget(key, event.currentTarget)}
                              >
                                <Trash2 aria-hidden="true" />
                              </button>

                              {deleteTarget?.id === key &&
                                createPortal(
                                  <ConfirmDelete
                                    type="button"
                                    $left={deleteTarget.left}
                                    $top={deleteTarget.top}
                                    onClick={() => confirmDelete(festival, index)}
                                  >
                                    삭제 확인
                                  </ConfirmDelete>,
                                  document.body,
                                )}
                            </ActionCell>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </TableScroll>

              <AdminPageNation
                currentPage={currentPage}
                itemLabel="개"
                itemNoun="축제"
                onPageChange={onPageChange}
                pageSize={PAGE_SIZE}
                totalItems={totalCount}
                visibleItems={filteredFestivals.length}
              />
            </TableCard>
          ) : (
            <EmptyState>
              <EmptyIconCard>
                <EmptyGlow />
                <PartyPopper aria-hidden="true" />
                <EmptyBadge>
                  <MapPinOff aria-hidden="true" />
                </EmptyBadge>
              </EmptyIconCard>

              <EmptyCopy>
                <EmptyTitle>
                  {searchTerm ? "검색 결과가 없습니다" : "등록된 페스티벌이 없습니다"}
                </EmptyTitle>
                <p>
                  {searchTerm
                    ? "입력한 검색어와 일치하는 페스티벌을 찾을 수 없습니다."
                    : "무대는 준비되었지만 아직 조명이 켜지지 않았습니다. 페스티벌 라인업을 구성하여 관객들에게 에너지를 전달해보세요."}
                </p>
              </EmptyCopy>
            </EmptyState>
          )}
        </ContentArea>
      </MainCanvas>
    </PageFrame>
  );
}

export default AdminFestival;
