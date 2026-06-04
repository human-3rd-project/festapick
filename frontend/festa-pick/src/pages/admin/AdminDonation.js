import React, { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import AdminNav from "./AdminNav";
import AdminPageNation from "./AdminPageNation";
import {
  ActionCell,
  AmountText,
  ConfirmDelete,
  ContentArea,
  DonationAvatar,
  DonationIdentity,
  DonationMeta,
  DonationName,
  EmptyCopy,
  EmptyGlow,
  EmptyImage,
  EmptyImageFrame,
  EmptyState,
  EmptyTitle,
  HeaderActions,
  HeaderCopy,
  HeaderBar,
  MainCanvas,
  PageFrame,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PreviewButton,
  PreviewControls,
  SearchBox,
  SearchIcon,
  SearchInput,
  Table,
  TableCard,
  TableScroll,
  TransactionText,
} from "./AdminDonationCss";

const emptyImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCIN_OlegOczpy-pNUzLFy8yqLyZaiEEM3pd6QZnEatB0e88Be0WUaLVeSvYRG58UHFig6fYPXGho-9nTXb5KNK2U5i7VN5JvgvNt-5FLKLjIaA3B4NFpU4hA38CMtJeAw7calJR0Qs80WbpVleuiy4EM3pDY1CPd0iBzhr-2SSmPmPGEor7KPg843lH4iSSKUm3XI_T9hCkI8qP5kkaqwEo4dGvBQntEui0gEDKEVR48CdWJS8sGJ12Ic6RT360UQ7GawOHxVSXAcM";

const sampleDonations = [
  {
    id: 1,
    donorName: "축제요정",
    email: "jiminh@gmail.com",
    amount: 10000,
    donatedAt: "2024.05.12 14:32",
    transactionId: "1",
  },
  {
    id: 2,
    donorName: "밤하늘",
    email: "sk_official@kakao.com",
    amount: 10000,
    donatedAt: "2024.05.11 09:15",
    transactionId: "2",
  },
  {
    id: 3,
    donorName: "흥부자",
    email: "leeya@naver.com",
    amount: 10000,
    donatedAt: "2024.05.10 22:45",
    transactionId: "3",
  },
  {
    id: 4,
    donorName: "행운아",
    email: "jwsung@daum.net",
    amount: 10000,
    donatedAt: "2024.05.10 18:20",
    transactionId: "4",
  },
  {
    id: 5,
    donorName: "꽃사슴",
    email: "bogum@gmail.com",
    amount: 10000,
    donatedAt: "2024.05.09 11:50",
    transactionId: "5",
  },
  {
    id: 6,
    donorName: "서울러버",
    email: "seoul_festa@gmail.com",
    amount: 10000,
    donatedAt: "2024.05.09 08:24",
    transactionId: "6",
  },
  {
    id: 7,
    donorName: "뮤직페어리",
    email: "musicfairy@naver.com",
    amount: 10000,
    donatedAt: "2024.05.08 20:18",
    transactionId: "7",
  },
  {
    id: 8,
    donorName: "페스티벌러",
    email: "festivaler@kakao.com",
    amount: 10000,
    donatedAt: "2024.05.08 17:04",
    transactionId: "8",
  },
  {
    id: 9,
    donorName: "봄나들이",
    email: "springday@gmail.com",
    amount: 10000,
    donatedAt: "2024.05.07 13:36",
    transactionId: "9",
  },
  {
    id: 10,
    donorName: "무대앞자리",
    email: "frontrow@daum.net",
    amount: 10000,
    donatedAt: "2024.05.07 10:10",
    transactionId: "10",
  },
];

const PAGE_SIZE = 10;

function getDonationKey(donation, index) {
  return donation.id || donation.transactionId || donation.orderId || index;
}

function getDonorName(donation) {
  return (
    donation.donorName ||
    donation.name ||
    donation.memberName ||
    donation.nickname ||
    "익명 후원자"
  );
}

function getDonorEmail(donation) {
  return donation.email || donation.userEmail || donation.memberEmail || "이메일 없음";
}

function getInitials(name = "") {
  const source = name.trim() || "후원";

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatAmount(amount) {
  const numericAmount =
    typeof amount === "number" ? amount : Number(String(amount || "").replace(/,/g, ""));

  if (Number.isNaN(numericAmount)) {
    return amount || "-";
  }

  return numericAmount.toLocaleString("ko-KR");
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
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function AdminDonation({
  donations,
  onSearchChange,
  onDeleteDonation,
  onPageChange,
  currentPage = 1,
  totalItems,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);
  const [previewMode, setPreviewMode] = useState("list");

  const hasProvidedDonations = Array.isArray(donations);
  const isPreviewingSample =
    previewMode === "list" && (!hasProvidedDonations || donations.length === 0);

  const donationSource = useMemo(() => {
    if (previewMode === "empty") {
      return [];
    }

    if (isPreviewingSample) {
      return sampleDonations;
    }

    return donations;
  }, [donations, isPreviewingSample, previewMode]);

  const visibleDonations = useMemo(
    () =>
      donationSource.filter(
        (donation, index) => !deletedIds.includes(getDonationKey(donation, index)),
      ),
    [deletedIds, donationSource],
  );

  const filteredDonations = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return visibleDonations;
    }

    return visibleDonations.filter((donation) => {
      const searchableText = [
        getDonorName(donation),
        getDonorEmail(donation),
        donation.amount,
        donation.donatedAt,
        donation.createdAt,
        donation.transactionId,
        donation.orderId,
        donation.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [searchTerm, visibleDonations]);

  const hasDonations = filteredDonations.length > 0;
  const totalCount = totalItems || visibleDonations.length;

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const confirmDelete = (donation, index) => {
    if (onDeleteDonation) {
      onDeleteDonation(donation);
    } else {
      setDeletedIds((prev) => [...prev, getDonationKey(donation, index)]);
    }

    setDeleteTargetId(null);
  };

  return (
    <PageFrame>
      <AdminNav />

      <MainCanvas>
        <ContentArea $isEmpty={!hasDonations}>
          <PageHeader>
            <HeaderCopy>
              <PageTitle>후원 내역</PageTitle>
              <PageSubtitle>
                축제 커뮤니티에 접수된 후원 기록과 결제 흐름을 빠르게 확인하고
                필요한 항목을 관리하세요.
              </PageSubtitle>
            </HeaderCopy>

            <HeaderActions>
              {/* 임시 확인 버튼: 후원 데이터 있음/없음 디자인 확인용, 실제 기능 연결 시 제거 */}
              <PreviewControls aria-label="후원 데이터 화면 상태 전환">
                <PreviewButton
                  type="button"
                  $active={previewMode === "list"}
                  onClick={() => setPreviewMode("list")}
                >
                  데이터 있음
                </PreviewButton>
                <PreviewButton
                  type="button"
                  $active={previewMode === "empty"}
                  onClick={() => setPreviewMode("empty")}
                >
                  데이터 없음
                </PreviewButton>
              </PreviewControls>
              {/* 임시 확인 버튼 끝 */}
            </HeaderActions>
          </PageHeader>

          {hasDonations ? (
            <TableCard>
              <HeaderBar>
                <h2>후원 기록</h2>

                <SearchBox>
                  <SearchIcon aria-hidden="true">
                    <Search />
                  </SearchIcon>
                  <SearchInput
                    type="search"
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </SearchBox>
              </HeaderBar>

              <TableScroll>
                <Table>
                  <thead>
                    <tr>
                      <th>후원자</th>
                      <th>금액 (KRW)</th>
                      <th>날짜</th>
                      <th>거래 ID</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((donation, index) => {
                      const key = getDonationKey(donation, index);
                      const donorName = getDonorName(donation);

                      return (
                        <tr key={key}>
                          <td>
                            <DonationIdentity>
                              <DonationAvatar $tone={index % 4}>
                                {getInitials(donorName)}
                              </DonationAvatar>
                              <div>
                                <DonationName>{donorName}</DonationName>
                                <DonationMeta>{getDonorEmail(donation)}</DonationMeta>
                              </div>
                            </DonationIdentity>
                          </td>
                          <td>
                            <AmountText>
                              {formatAmount(donation.amount || donation.price)}
                            </AmountText>
                          </td>
                          <td>{formatDate(donation.donatedAt || donation.createdAt)}</td>
                          <td>
                            <TransactionText>
                              {donation.transactionId || donation.orderId || donation.id || "-"}
                            </TransactionText>
                          </td>
                          <td>
                            <ActionCell>
                              <button
                                type="button"
                                aria-label={`${donorName} 후원 내역 삭제`}
                                onClick={() => setDeleteTargetId(key)}
                              >
                                <Trash2 aria-hidden="true" />
                                <span>삭제</span>
                              </button>

                              {deleteTargetId === key && (
                                <ConfirmDelete
                                  type="button"
                                  onClick={() => confirmDelete(donation, index)}
                                >
                                  삭제 확인
                                </ConfirmDelete>
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
                onPageChange={onPageChange}
                pageSize={PAGE_SIZE}
                totalItems={totalCount}
                visibleItems={filteredDonations.length}
              />
            </TableCard>
          ) : (
            <EmptyState>
              <EmptyImageFrame>
                <EmptyGlow $position="top" />
                <EmptyGlow $position="bottom" />
                <EmptyImage src={emptyImageUrl} alt="" aria-hidden="true" />
              </EmptyImageFrame>

              <EmptyCopy>
                <EmptyTitle>
                  {searchTerm ? "검색 결과가 없습니다" : "아직 기부 내역이 없습니다"}
                </EmptyTitle>
                <p>
                  {searchTerm
                    ? "입력한 검색어와 일치하는 후원 기록을 찾을 수 없습니다."
                    : "귀하의 축제 커뮤니티에서 아직 기부를 시작하지 않았습니다. 첫 번째 기부가 이루어지면 실시간으로 여기에 표시됩니다."}
                </p>
              </EmptyCopy>
            </EmptyState>
          )}
        </ContentArea>
      </MainCanvas>
    </PageFrame>
  );
}

export default AdminDonation;
