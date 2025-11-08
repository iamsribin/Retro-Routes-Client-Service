import { useState, useEffect, useCallback, useRef } from 'react';
import { handleCustomError } from '../utils/error';

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface UsePaginatedSearchOptions<T> {
  fetchFn: (params: {
    page: number;
    limit: number;
    search: string;
    signal?: AbortSignal;
  }) => Promise<{
    data: T[];
    pagination: PaginationState;
  }>;
  itemsPerPage?: number;
  debounceMs?: number;
  onError?: (error: any) => void;
}

export interface UsePaginatedSearchReturn<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  pagination: PaginationState;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  refresh: () => void;
}

export function usePaginatedSearch<T = any>({
  fetchFn,
  itemsPerPage = 10,
  debounceMs = 500,
  onError,
}: UsePaginatedSearchOptions<T>): UsePaginatedSearchReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search term
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, debounceMs]);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: debouncedSearch,
        signal: abortControllerRef.current.signal,
      });

      setData(result.data);
      setPagination((prev) => ({
        ...prev,
        ...result.pagination,
      }));
    } catch (err: any) {
      const isAborted = 
        err.name === 'AbortError' || 
        err.code === 'ERR_CANCELED' ||
        err.message?.includes('cancel');
      
      if (!isAborted) {
        const error = err instanceof Error ? err : new Error('Failed to fetch data');
        handleCustomError(error)
        setError(error);
        if (onError) {
          onError(error);
        }
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, pagination.currentPage, pagination.itemsPerPage, debouncedSearch, onError]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    setPage,
    refresh,
  };
}