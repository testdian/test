import { useMemo, useState } from 'react';

export const formatDate = (dateString?: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

export function usePagination<T>(items: T[], defaultPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  );

  const resetPage = () => setCurrentPage(1);

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage: safePage,
    pageSize,
    totalPages,
    total: items.length,
    paginatedItems,
    setCurrentPage,
    onPageSizeChange,
    resetPage,
  };
}

export function parseReductionTonnes(value?: string | null): number {
  if (!value) return 0;
  const num = parseFloat(String(value).replace(/[^\d.]/g, ''));
  return Number.isNaN(num) ? 0 : num;
}
