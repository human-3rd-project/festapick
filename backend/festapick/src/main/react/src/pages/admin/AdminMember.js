import React, { useCallback, useEffect, useState } from "react";
import {
  Pencil,
  Search,
  UserX,
  X,
} from "lucide-react";
import AdminNav from "./AdminNav";
import AdminPageNation from "./AdminPageNation";
import AxiosApi from "../../api/AxiosApi";
import {
  ActionButton,
  ActionGroup,
  ContentShell,
  EmptyChip,
  EmptyDescription,
  EmptyIllustration,
  EmptyImage,
  EmptyState,
  EmptyTitle,
  HeaderActions,
  HeaderCopy,
  HeaderRow,
  IllustrationGlow,
  MainCanvas,
  MemberAvatar,
  MemberIdentity,
  MemberMeta,
  MemberName,
  ModalActions,
  ModalBackdrop,
  ModalBody,
  ModalCard,
  ModalClose,
  ModalHeader,
  ModalOption,
  ModalOverlay,
  PageFrame,
  PageSubtitle,
  PageTitle,
  PlanBadge,
  SearchBox,
  SearchIcon,
  SearchInput,
  StatPill,
  StatusBadge,
  Table,
  TableCard,
  TableScroll,
  TextButton,
} from "./AdminMemberCss";

const emptyImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDdCK0Ig1hPZ_SfzDuN_T_MEHnyeZQI_BkR6j0CYI9fegC4MIdv6Df_1c_JfTpNIhtee8_1ZA7S0J8g7CUwPbnRn0L28hDq1J3CyLrTjEck-p5wk6qILf27mqWD151NIjkXztaYwFqcjZTXPPcGRYE2hh4fR0d5phhsYIWjiywBRhtco_8ODhelnQqx81ITzIOoe4uM9ZPvjeqFfpNA0IaKN0-nUHYc7nQI2ON-3kmjpZ8idsgxubuA1hK-LBSfeKXpNB1Wr4jlt7jd";

const PAGE_SIZE = 10;

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

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getMemberName(member) {
  return member.name || member.nickname || member.loginId || "이름 없음";
}

function getMemberAvatar(member) {
  return member.profileImageUrl || member.avatar || member.profileImage || "";
}

function getMemberId(member, index) {
  return member.userId || member.id || index + 1;
}

function normalizeMemberStatus(status) {
  const value = String(status || "").toUpperCase();
  return value === "SUSPENDED" ? "SUSPENDED" : "ACTIVE";
}

function getMemberStatusLabel(status) {
  return normalizeMemberStatus(status) === "SUSPENDED" ? "정지" : "활성";
}

function formatDate(value) {
  if (!value) {
    return "-";
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

function AdminMember() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ACTIVE");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await AxiosApi.adminUserSearch(
        debouncedSearchTerm,
        currentPage - 1,
        PAGE_SIZE,
      );
      const page = readPageResponse(response);

      setMembers(page.content);
      setTotalItems(page.totalElements);
    } catch (fetchError) {
      setMembers([]);
      setTotalItems(0);
      setError(getAdminErrorMessage(fetchError, "회원 목록을 불러오지 못했습니다."));
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
    fetchMembers();
  }, [fetchMembers]);

  const hasMembers = members.length > 0;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const openStatusModal = (member) => {
    setEditingMember(member);
    setSelectedStatus(normalizeMemberStatus(member.status));
  };

  const closeStatusModal = () => {
    setEditingMember(null);
  };

  const saveStatus = async () => {
    if (!editingMember) {
      return;
    }

    const userId = editingMember.userId || editingMember.id;

    if (!userId) {
      setError("상태를 변경할 회원 ID가 없습니다.");
      return;
    }

    try {
      await AxiosApi.adminUserUpdate(userId, selectedStatus);
      closeStatusModal();
      await fetchMembers();
    } catch (updateError) {
      setError(getAdminErrorMessage(updateError, "회원 상태를 변경하지 못했습니다."));
    }
  };

  return (
    <PageFrame>
      <AdminNav />

      <MainCanvas>
        <ContentShell $isEmpty={!hasMembers}>
          <HeaderRow $isEmpty={!hasMembers}>
            <HeaderCopy>
              <PageTitle>회원 관리</PageTitle>
              <PageSubtitle>
                사용자 권한을 관리하고, 회원 통계를 검토하며, 플랫폼 안전을
                유지하세요.
              </PageSubtitle>
            </HeaderCopy>

            <HeaderActions>
              <SearchBox>
                <SearchIcon aria-hidden="true">
                  <Search />
                </SearchIcon>
                <SearchInput
                  type="search"
                  placeholder="회원 검색..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </SearchBox>

              <StatPill>
                <strong>{totalItems.toLocaleString()}</strong>
                <span>총 회원 수</span>
              </StatPill>
            </HeaderActions>
          </HeaderRow>

          {hasMembers ? (
            <TableCard>
              <TableScroll>
                <Table>
                  <thead>
                    <tr>
                      <th>아이디</th>
                      <th>회원</th>
                      <th>가입일</th>
                      <th>상태</th>
                      <th>플랜</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => {
                      const key = member.userId || member.id || member.email || index;
                      const memberName = getMemberName(member);
                      const memberAvatar = getMemberAvatar(member);

                      return (
                      <tr key={key}>
                        <td>{getMemberId(member, index)}</td>
                        <td>
                          <MemberIdentity>
                            <MemberAvatar $tone={index % 3}>
                              {memberAvatar ? (
                                <img src={memberAvatar} alt={memberName} />
                              ) : (
                                getInitials(memberName || member.email)
                              )}
                            </MemberAvatar>
                            <div>
                              <MemberName>{memberName}</MemberName>
                              <MemberMeta>{member.email || "이메일 없음"}</MemberMeta>
                            </div>
                          </MemberIdentity>
                        </td>
                        <td>{formatDate(member.joinedAt || member.createdAt)}</td>
                        <td>
                          <StatusBadge $status={normalizeMemberStatus(member.status)}>
                            {getMemberStatusLabel(member.status)}
                          </StatusBadge>
                        </td>
                        <td>
                          <PlanBadge $premium={member.plan === "프리미엄" || member.role === "PREMIUM"}>
                            {member.plan || member.role || "무료"}
                          </PlanBadge>
                        </td>
                        <td>
                          <ActionGroup>
                            <ActionButton
                              type="button"
                              aria-label="회원 상태 수정"
                              onClick={() => openStatusModal(member)}
                            >
                              <Pencil />
                            </ActionButton>
                          </ActionGroup>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </TableScroll>

              <AdminPageNation
                currentPage={currentPage}
                itemLabel="명"
                itemNoun=""
                onPageChange={setCurrentPage}
                pageSize={PAGE_SIZE}
                totalItems={totalItems}
                visibleItems={members.length}
              />
            </TableCard>
          ) : (
            <EmptyState>
              <EmptyIllustration>
                <IllustrationGlow />
                <EmptyImage src={emptyImageUrl} alt="" aria-hidden="true" />
                <UserX aria-hidden="true" />
                <EmptyChip $position="right">회원 0명</EmptyChip>
                <EmptyChip $position="left">활성 세션 없음</EmptyChip>
              </EmptyIllustration>

              <EmptyTitle>
                {isLoading
                  ? "회원 목록을 불러오는 중입니다"
                  : error || (searchTerm ? "검색 결과가 없습니다" : "가입된 회원이 없습니다")}
              </EmptyTitle>
              <EmptyDescription>
                {isLoading
                  ? "잠시만 기다려 주세요."
                  : error
                    ? "로그인 상태와 관리자 권한을 확인해 주세요."
                    : searchTerm
                  ? "입력한 검색어와 일치하는 회원을 찾을 수 없습니다."
                  : "회원 목록이 비어 있습니다. 관리자, 스태프 또는 주요 페스티벌 게스트를 초대하여 커뮤니티를 성장시켜 보세요."}
              </EmptyDescription>
            </EmptyState>
          )}
        </ContentShell>
      </MainCanvas>

      {editingMember && (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="status-title">
          <ModalBackdrop onClick={closeStatusModal} />
          <ModalCard>
            <ModalHeader>
              <h3 id="status-title">상태 변경</h3>
              <ModalClose
                type="button"
                aria-label="상태 변경 창 닫기"
                onClick={closeStatusModal}
              >
                <X />
              </ModalClose>
            </ModalHeader>
            <ModalBody>
              <p>이 회원의 새로운 상태를 선택하세요:</p>
              {[
                ["ACTIVE", "활성", "회원이 플랫폼에 대한 전체 액세스 권한을 가집니다."],
                ["SUSPENDED", "정지", "계정 액세스가 제한됩니다."],
              ].map(([value, label, description]) => (
                <ModalOption key={value}>
                  <input
                    type="radio"
                    name="status"
                    value={value}
                    checked={selectedStatus === value}
                    onChange={() => setSelectedStatus(value)}
                  />
                  <span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                </ModalOption>
              ))}
            </ModalBody>
            <ModalActions>
              <TextButton type="button" onClick={closeStatusModal}>
                취소
              </TextButton>
              <TextButton type="button" $primary onClick={saveStatus}>
                변경 사항 저장
              </TextButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageFrame>
  );
}

export default AdminMember;
