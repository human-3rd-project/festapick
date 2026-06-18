import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapPinOff, PartyPopper, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import AdminPageNation from "./AdminPageNation";
import AxiosApi from "../../api/AxiosApi";
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
  FestivalLink,
  FestivalMeta,
  HeaderActions,
  HeaderCopy,
  MainCanvas,
  PageFrame,
  PageHeader,
  PageSubtitle,
  PageTitle,
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

function readPageResponse(response) {
  const page = response?.data?.data || {};

  return {
    content: Array.isArray(page.content) ? page.content : [],
    totalElements: Number(page.totalElements || 0),
  };
}

function getAdminErrorMessage(error, fallbackMessage) {
  if (error?.response?.status === 403) {
    return "관리자 권한이 필요합니다.";
  }

  return error?.response?.data?.message || fallbackMessage;
}

function getFestivalKey(festival, index) {
  return festival.festivalId || festival.id || festival.uuid || index;
}

function getFestivalDetailId(festival) {
  return festival.festivalId || festival.id || null;
}

function getFestivalName(festival) {
  return festival.name || festival.title || festival.festivalName || "이름 없는 축제";
}

function getFestivalCategory(festival) {
  return festival.categoryName || festival.category || festival.genre || festival.type || "카테고리 없음";
}

function getFestivalLocation(festival) {
  const address = [festival.addr1, festival.addr2].filter(Boolean).join(" ");
  return address || festival.location || festival.region || festival.address || "위치 없음";
}

function getFestivalImage(festival) {
  return festival.firstImage || festival.image || festival.thumbnail || festival.poster || festival.imageUrl || "";
}

function getFestivalStatus(festival) {
  const status = String(festival.status || festival.state || "").toUpperCase();

  if (festival.statusLabel) {
    return festival.statusLabel;
  }

  if (status === "ACTIVE" || status === "ONGOING") {
    return "진행 중";
  }

  if (status === "ENDED" || status === "CLOSED") {
    return "종료됨";
  }

  if (status === "HIDDEN") {
    return "숨김";
  }

  if (status === "SCHEDULED" || status === "UPCOMING") {
    return "예정";
  }

  return status || "상태 없음";
}

function isActiveFestival(festival) {
  const status = String(festival.status || festival.state || "").toUpperCase();
  const label = getFestivalStatus(festival);

  return status === "ACTIVE" || status === "ONGOING" || label === "진행 중";
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
  const start = formatDate(
    festival.eventStartDate || festival.startDate || festival.startedAt || festival.startAt,
  );
  const end = formatDate(
    festival.eventEndDate || festival.endDate || festival.endedAt || festival.endAt,
  );

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end || festival.period || "-";
}

function AdminFestival() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [festivals, setFestivals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const fetchFestivals = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await AxiosApi.adminFestivalSearch(
        debouncedSearchTerm,
        currentPage - 1,
        PAGE_SIZE,
      );
      const page = readPageResponse(response);

      setFestivals(page.content);
      setTotalItems(page.totalElements);
    } catch (fetchError) {
      setFestivals([]);
      setTotalItems(0);
      setError(getAdminErrorMessage(fetchError, "축제 목록을 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  const hasFestivals = festivals.length > 0;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const confirmDelete = async (festival) => {
    const festivalId = getFestivalDetailId(festival);

    if (!festivalId) {
      setError("삭제할 축제 ID가 없습니다.");
      setDeleteTarget(null);
      return;
    }

    try {
      await AxiosApi.adminFestivalDelete(festivalId);
      setDeleteTarget(null);
      await fetchFestivals();
    } catch (deleteError) {
      setError(getAdminErrorMessage(deleteError, "축제를 삭제하지 못했습니다."));
      setDeleteTarget(null);
    }
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

  const goFestivalDetail = (festival) => {
    const festivalId = getFestivalDetailId(festival);

    if (festivalId) {
      navigate(`/detail/${festivalId}`);
    }
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
                <strong>{totalItems.toLocaleString("ko-KR")}</strong>
                <span>총 축제 수</span>
              </StatPill>
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
                    {festivals.map((festival, index) => {
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
                                <FestivalLink
                                  type="button"
                                  disabled={!getFestivalDetailId(festival)}
                                  onClick={() => goFestivalDetail(festival)}
                                >
                                  {festivalName}
                                </FestivalLink>
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
                                    onClick={() => confirmDelete(festival)}
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
                onPageChange={setCurrentPage}
                pageSize={PAGE_SIZE}
                totalItems={totalItems}
                visibleItems={festivals.length}
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
                  {isLoading
                    ? "축제 목록을 불러오는 중입니다"
                    : error || (searchTerm ? "검색 결과가 없습니다" : "등록된 페스티벌이 없습니다")}
                </EmptyTitle>
                <p>
                  {isLoading
                    ? "잠시만 기다려 주세요."
                    : error
                      ? "로그인 상태와 관리자 권한을 확인해 주세요."
                      : searchTerm
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
