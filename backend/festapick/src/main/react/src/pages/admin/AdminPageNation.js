import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  PageButton,
  PageInfo,
  PageNationBar,
  PageNationControls,
} from "./AdminPageNationCss";

const DEFAULT_PAGE_SIZE = 10;
const SIBLING_PAGE_COUNT = 2;

function getPageNumbers(currentPage, totalPages) {
  const startPage = Math.max(1, currentPage - SIBLING_PAGE_COUNT);
  const endPage = Math.min(totalPages, currentPage + SIBLING_PAGE_COUNT);
  const pages = [1, totalPages];

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  return [...new Set(pages)].sort((a, b) => a - b);
}

function AdminPageNation({
  currentPage = 1,
  itemLabel = "개",
  itemNoun = "항목",
  onPageChange,
  pageSize = DEFAULT_PAGE_SIZE,
  totalItems = 0,
  visibleItems = 0,
}) {
  const [internalPage, setInternalPage] = useState(currentPage);
  const activePage = onPageChange ? currentPage : internalPage;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems > 0 && visibleItems > 0 ? (activePage - 1) * pageSize + 1 : 0;
  const endItem =
    totalItems > 0 && visibleItems > 0
      ? Math.min(startItem + visibleItems - 1, totalItems)
      : 0;

  const pageNumbers = useMemo(
    () => getPageNumbers(activePage, totalPages),
    [activePage, totalPages],
  );

  useEffect(() => {
    setInternalPage(currentPage);
  }, [currentPage]);

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === activePage) {
      return;
    }

    if (onPageChange) {
      onPageChange(page);
      return;
    }

    setInternalPage(page);
  };

  return (
    <PageNationBar>
      <PageInfo>
        {totalItems.toLocaleString("ko-KR")}
        {itemLabel}
        {itemNoun ? ` ${itemNoun}` : ""} 중{" "}
        <strong>
          {startItem} - {endItem}
        </strong>{" "}
        표시
      </PageInfo>

      <PageNationControls>
        <PageButton
          type="button"
          disabled={activePage <= 1}
          aria-label="이전 페이지"
          onClick={() => changePage(activePage - 1)}
        >
          <ChevronLeft />
        </PageButton>

        {pageNumbers.map((page, index) => (
          <React.Fragment key={page}>
            {index > 0 && pageNumbers[index - 1] + 1 < page && <span>...</span>}
            <PageButton
              type="button"
              $active={activePage === page}
              onClick={() => changePage(page)}
            >
              {page}
            </PageButton>
          </React.Fragment>
        ))}

        <PageButton
          type="button"
          disabled={activePage >= totalPages}
          aria-label="다음 페이지"
          onClick={() => changePage(activePage + 1)}
        >
          <ChevronRight />
        </PageButton>
      </PageNationControls>
    </PageNationBar>
  );
}

export default AdminPageNation;
