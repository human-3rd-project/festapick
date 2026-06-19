import React, { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import AdminNav from "./AdminNav";
import AdminPageNation from "./AdminPageNation";
import AxiosApi from "../../api/AxiosApi";
import {
  AmountText,
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
  SearchBox,
  SearchIcon,
  SearchInput,
  StatPill,
  Table,
  TableCard,
  TableScroll,
  TransactionText,
} from "./AdminDonationCss";

const emptyImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCIN_OlegOczpy-pNUzLFy8yqLyZaiEEM3pd6QZnEatB0e88Be0WUaLVeSvYRG58UHFig6fYPXGho-9nTXb5KNK2U5i7VN5JvgvNt-5FLKLjIaA3B4NFpU4hA38CMtJeAw7calJR0Qs80WbpVleuiy4EM3pDY1CPd0iBzhr-2SSmPmPGEor7KPg843lH4iSSKUm3XI_T9hCkI8qP5kkaqwEo4dGvBQntEui0gEDKEVR48CdWJS8sGJ12Ic6RT360UQ7GawOHxVSXAcM";

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

function getDonationKey(donation, index) {
  return donation.donationId || donation.id || donation.transactionId || donation.orderId || index;
}

function getDonorName(donation) {
  return (
    donation.nickname ||
    donation.donorName ||
    donation.name ||
    donation.memberName ||
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

function AdminDonation() {
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const fetchDonations = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await AxiosApi.adminDonationSearch(
        debouncedSearchTerm,
        currentPage - 1,
        PAGE_SIZE,
      );
      const page = readPageResponse(response);

      setDonations(page.content);
      setTotalItems(page.totalElements);
    } catch (fetchError) {
      setDonations([]);
      setTotalItems(0);
      setError(getAdminErrorMessage(fetchError, "후원 내역을 불러오지 못했습니다."));
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
    fetchDonations();
  }, [fetchDonations]);

  const hasDonations = donations.length > 0;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
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

              <StatPill>
                <strong>{totalItems.toLocaleString("ko-KR")}</strong>
                <span>총 후원 수</span>
              </StatPill>
            </HeaderActions>
          </PageHeader>

          {hasDonations ? (
            <TableCard>
              <HeaderBar>
                <h2>후원 기록</h2>
              </HeaderBar>

              <TableScroll>
                <Table>
                  <thead>
                    <tr>
                      <th>후원자</th>
                      <th>금액 (KRW)</th>
                      <th>날짜</th>
                      <th>거래 ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation, index) => {
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
                          <td>{formatDate(donation.approvedAt || donation.donatedAt)}</td>
                          <td>
                            <TransactionText>
                              {donation.orderId || donation.transactionId || donation.donationId || donation.id || "-"}
                            </TransactionText>
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
                onPageChange={setCurrentPage}
                pageSize={PAGE_SIZE}
                totalItems={totalItems}
                visibleItems={donations.length}
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
                  {isLoading
                    ? "후원 내역을 불러오는 중입니다"
                    : error || (searchTerm ? "검색 결과가 없습니다" : "아직 기부 내역이 없습니다")}
                </EmptyTitle>
                <p>
                  {isLoading
                    ? "잠시만 기다려 주세요."
                    : error
                      ? "로그인 상태와 관리자 권한을 확인해 주세요."
                      : searchTerm
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
