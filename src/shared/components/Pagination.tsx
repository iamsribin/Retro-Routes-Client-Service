import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { PaginationState } from '../hooks/usePaginatedSearch';

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showInfo?: boolean;
  itemName?: string;
  maxButtons?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  loading = false,
  showInfo = true,
  itemName = 'items',
  maxButtons = 5,
}) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const buttons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // First page button
    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={loading}
        >
          1
        </Button>
      );

      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(i)}
          disabled={loading}
        >
          {i}
        </Button>
      );
    }

    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>
        );
      }

      buttons.push(
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={loading}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between py-4">
      {showInfo && (
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalItems} {itemName}
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </Button>

        {renderPageButtons()}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
};