import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSearchParams, useSearchParams } from 'react-router-dom';

interface IUseSPCache<T> {
  payload: {
    meta: { pagination: { total: number; limit: number; offset: number } };
    data: T[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
  };
  fetcher: (offset: number, limit: number) => Promise<any> | void;
  defaultLimit?: number;
  defaultOffset?: number;
  usingCache?: boolean;
  offsetParamName?: string;
  limitParamName?: string;
}

export type IUseSPCacheType<T> = {
  dataList: T[];
  loading: boolean;
  meta: { limit: number; offset: number; total: number };
  changePage: (pageNumber?: number, newLimit?: number) => void;
  changeLimit: (limit: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  tableReset: () => void;
  refetch: () => void;
};

export const useCache = <T>({
  payload,
  fetcher,
  defaultLimit = 10,
  defaultOffset = 0,
  usingCache = true,
  offsetParamName,
  limitParamName,
}: IUseSPCache<T>): IUseSPCacheType<T> => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { pathname } = location;
  const navigate = useNavigate();

  const paramOffset: string = searchParams.get(offsetParamName || 'offset') || '';
  const paramLimit: string = searchParams.get(limitParamName || 'limit') || '';

  const [cacheList, setCacheList] = useState<{ [key: number]: T[] } | null>({});
  const cacheListRef = useRef<{ [key: number]: T[] }>({});
  const [currentOffset, setCurrentOffset] = useState<number>(
    (parseInt(paramOffset, 10) || defaultOffset) ?? 0,
  );
  const [currentLimit, setCurrentLimit] = useState<number>(
    (parseInt(paramLimit, 10) || defaultLimit) ?? 10,
  );
  const [total, setTotal] = useState(0);

  const fetchRef = useRef<any>(null);
  const cacheTimeout = useRef(0);

  const currentPage = useMemo(
    () => (currentOffset + currentLimit) / currentLimit,
    [currentLimit, currentOffset],
  );

  const paginationDataList = useMemo(
    () => cacheList?.[currentOffset] ?? [],
    [cacheList, currentOffset],
  );

  const dataList = paginationDataList;

  useEffect(() => {
    if (payload?.data) {
      if (payload?.meta?.pagination) {
        const { meta, data } = payload;
        cacheListRef.current = { ...cacheListRef.current, [meta.pagination.offset]: data };
        setTotal(() => meta.pagination.total);
        setCacheList((prevState) => ({ ...prevState, [meta.pagination.offset]: data }));
      }
    }
  }, [payload.data]);

  useEffect(() => () => reset(), []);

  useEffect(() => {
    const now = Date.now();

    if (now > cacheTimeout.current || !usingCache) {
      setCacheList(null);
      cacheListRef.current = {};
      cacheTimeout.current = now + 1000 * 60 * 2;
    }

    if (!cacheListRef.current[currentOffset] || !usingCache) {
      fetchRef.current = fetcher(currentOffset, currentLimit);
    }
  }, []);

  const fetch = (offset: number, newLimit: number = currentLimit) => {
    const now = Date.now();

    if (now > cacheTimeout.current || !usingCache) {
      setCacheList(null);
      cacheListRef.current = {};
      cacheTimeout.current = now + 1000 * 60 * 2;
    }

    if (!cacheListRef.current[offset] || !usingCache) {
      fetchRef.current = fetcher(offset, newLimit);
    }

    setCurrentOffset(offset);
  };

  const reset = () => {
    cacheListRef.current = {};
    setCacheList(null);
    setCurrentOffset(0);
    setTotal(0);
    cacheTimeout.current = 0;
  };

  const changeLimit = (limit: number) => {
    setCurrentLimit(() => limit);
  };

  const refetch = () => {
    fetch(currentOffset);
  };

  const changePage = (pageNumber?: number, newLimit: number = currentLimit) => {
    let newOffset;
    if (pageNumber) {
      newOffset = (pageNumber - 1) * newLimit;
    } else if (newLimit !== currentLimit) {
      newOffset = Math.floor(currentOffset / newLimit) * newLimit;
    } else {
      newOffset = currentOffset;
    }

    const offsetParamKey = offsetParamName ?? 'offset';
    const limitParamKey = limitParamName ?? 'limit';
    const newSearchParams: { [key: string]: string } = {};

    for (const entry of searchParams.entries()) {
      const [param, value] = entry;
      newSearchParams[param] = String(value);
    }
    newSearchParams[offsetParamKey] = String(newOffset);
    newSearchParams[limitParamKey] = String(newLimit);
    navigate(
      {
        pathname,
        search: createSearchParams(newSearchParams).toString(),
      },
      { state: { ...location.state } },
    );

    changeLimit(newLimit);
    fetch(newOffset, newLimit);
  };

  const handleNextPage = () => {
    if (Math.ceil(total / currentLimit) > currentPage) {
      changePage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  return {
    dataList,
    loading: payload.status === 'loading',
    meta: { limit: currentLimit, offset: currentOffset, total },
    changePage,
    changeLimit,
    handleNextPage,
    handlePrevPage,
    tableReset: reset,
    refetch,
  };
};

export default useCache;
