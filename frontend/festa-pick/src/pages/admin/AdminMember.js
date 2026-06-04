import React, { useMemo, useState } from "react";
import {
  Pencil,
  Search,
  Trash2,
  UserX,
  X,
} from "lucide-react";
import AdminNav from "./AdminNav";
import AdminPageNation from "./AdminPageNation";
import {
  ActionButton,
  ActionGroup,
  ConfirmDelete,
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

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function AdminMember({
  members = [],
  onSearchChange,
  onEditMember,
  onDeleteMember,
  onSaveStatus,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showSampleMembers, setShowSampleMembers] = useState(false);

  const sampleMembers = useMemo(
    () => [
      {
        id: 1,
        name: "Alex Rivera",
        email: "arivera.studio@gmail.com",
        joinedAt: "Nov 02, 2023",
        status: "blocked",
        statusLabel: "차단됨",
        plan: "무료",
      },
      {
        id: 2,
        name: "Sarah Miller",
        email: "sarah.m@lifestyle.com",
        joinedAt: "Nov 15, 2023",
        status: "active",
        statusLabel: "활성",
        plan: "프리미엄",
      },
      {
        id: 3,
        name: "Kevin White",
        email: "k.white@techcorp.com",
        joinedAt: "Dec 12, 2023",
        status: "pending",
        statusLabel: "대기중",
        plan: "무료",
      },
    ],
    [],
  );

  const displayMembers = showSampleMembers ? sampleMembers : members;

  const filteredMembers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return displayMembers;
    }

    return displayMembers.filter((member) => {
      const searchableText = [
        member.id,
        member.name,
        member.email,
        member.status,
        member.plan,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [displayMembers, searchTerm]);

  const hasMembers = filteredMembers.length > 0;

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const openStatusModal = (member) => {
    setEditingMember(member);
    setSelectedStatus(member.status || "active");

    if (onEditMember) {
      onEditMember(member);
    }
  };

  const closeStatusModal = () => {
    setEditingMember(null);
  };

  const saveStatus = () => {
    if (onSaveStatus && editingMember) {
      onSaveStatus(editingMember, selectedStatus);
    }

    closeStatusModal();
  };

  const confirmDelete = (member) => {
    if (onDeleteMember) {
      onDeleteMember(member);
    }

    setDeleteTargetId(null);
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
                <strong>{displayMembers.length.toLocaleString()}</strong>
                <span>총 회원 수</span>
              </StatPill>

              {/* 임시 확인 버튼: 회원 있음/없음 디자인 확인용, 실제 기능 연결 시 제거 */}
              <TextButton
                type="button"
                onClick={() => setShowSampleMembers((prev) => !prev)}
              >
                {showSampleMembers ? "빈 상태 보기" : "목록 상태 보기"}
              </TextButton>
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
                    {filteredMembers.map((member, index) => (
                      <tr key={member.id || member.email || index}>
                        <td>{member.id || index + 1}</td>
                        <td>
                          <MemberIdentity>
                            <MemberAvatar $tone={index % 3}>
                              {member.avatar ? (
                                <img src={member.avatar} alt={member.name} />
                              ) : (
                                getInitials(member.name || member.email)
                              )}
                            </MemberAvatar>
                            <div>
                              <MemberName>{member.name || "이름 없음"}</MemberName>
                              <MemberMeta>{member.email || "이메일 없음"}</MemberMeta>
                            </div>
                          </MemberIdentity>
                        </td>
                        <td>{member.joinedAt || "-"}</td>
                        <td>
                          <StatusBadge $status={member.status}>
                            {member.statusLabel || member.status || "대기중"}
                          </StatusBadge>
                        </td>
                        <td>
                          <PlanBadge $premium={member.plan === "프리미엄"}>
                            {member.plan || "무료"}
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
                            <ActionButton
                              type="button"
                              aria-label="회원 삭제"
                              $danger
                              onClick={() => setDeleteTargetId(member.id)}
                            >
                              <Trash2 />
                            </ActionButton>
                            {deleteTargetId === member.id && (
                              <ConfirmDelete
                                type="button"
                                onClick={() => confirmDelete(member)}
                              >
                                삭제 확인
                              </ConfirmDelete>
                            )}
                          </ActionGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableScroll>

              <AdminPageNation
                currentPage={1}
                itemLabel="명"
                itemNoun=""
                pageSize={PAGE_SIZE}
                totalItems={displayMembers.length}
                visibleItems={filteredMembers.length}
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
                {searchTerm ? "검색 결과가 없습니다" : "가입된 회원이 없습니다"}
              </EmptyTitle>
              <EmptyDescription>
                {searchTerm
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
                ["active", "활성 (Active)", "회원이 플랫폼에 대한 전체 액세스 권한을 가집니다."],
                ["blocked", "차단 (Blocked)", "회원이 자신의 계정에 액세스할 수 없습니다."],
                ["suspended", "정지 (Suspended)", "계정 액세스가 일시적으로 제한됩니다."],
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
