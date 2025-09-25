import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { UI } from '../constants';
import { fetchProducts } from '../api/products';
import { parsePageFromUrl, buildPagination } from '../utils/pagination';
import { sanitizeNumberInput, isPriceRangeInvalid } from '../utils/filters';
import { useQueryParams } from './useQueryParams';

const PAGE_SIZE = UI.PAGE_SIZE;

function filtersReducer(state, action) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true, error: '', fromInput: action.from ?? '', toInput: action.to ?? '' };
    case 'close':
      return { ...state, open: false, error: '' };
    case 'set_from':
      return { ...state, fromInput: sanitizeNumberInput(action.value), error: '' };
    case 'set_to':
      return { ...state, toInput: sanitizeNumberInput(action.value), error: '' };
    case 'error':
      return { ...state, error: action.message ?? '' };
    default:
      return state;
  }
}

function sortReducer(state, action) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
    default:
      return state;
  }
}

export function useFiltersAndSort() {
  const { getParam, setParamAndResetPage, setParamsBatchAndResetPage } = useQueryParams();
  const [filterState, dispatchFilter] = useReducer(filtersReducer, { open: false, error: '', fromInput: '', toInput: '' });
  const [sortState, dispatchSort] = useReducer(sortReducer, { open: false });

  const sort = getParam('sort', '-created_at');
  const priceFrom = getParam('price_from', '');
  const priceTo = getParam('price_to', '');

  const sortLabel = useMemo(() => {
    switch (sort) {
      case '-created_at':
        return 'New products first';
      case 'price':
        return 'Price, low to high';
      case '-price':
        return 'Price, high to low';
      default:
        return 'Sort by';
    }
  }, [sort]);

  const openFilters = useCallback(() => {
    dispatchFilter({ type: 'open', from: priceFrom, to: priceTo });
  }, [priceFrom, priceTo]);

  const closeFilters = useCallback(() => dispatchFilter({ type: 'close' }), []);
  const setFromInput = useCallback((v) => dispatchFilter({ type: 'set_from', value: v }), []);
  const setToInput = useCallback((v) => dispatchFilter({ type: 'set_to', value: v }), []);

  const applyFilters = useCallback(() => {
    const invalid = isPriceRangeInvalid(filterState.fromInput, filterState.toInput);
    if (invalid) {
      dispatchFilter({ type: 'error', message: 'From must be less than or equal to To' });
      return false;
    }
    dispatchFilter({ type: 'error', message: '' });
    setParamsBatchAndResetPage({ 'price_from': filterState.fromInput, 'price_to': filterState.toInput });
    closeFilters();
    return true;
  }, [filterState.fromInput, filterState.toInput, setParamsBatchAndResetPage, closeFilters]);

  const clearFilters = useCallback(() => {
    setParamsBatchAndResetPage({ 'price_from': '', 'price_to': '' });
  }, [setParamsBatchAndResetPage]);

  const openSort = useCallback(() => dispatchSort({ type: 'open' }), []);
  const closeSort = useCallback(() => dispatchSort({ type: 'close' }), []);
  const setSort = useCallback((value) => {
    setParamAndResetPage('sort', value);
    closeSort();
  }, [setParamAndResetPage, closeSort]);

  const rangeInvalid = useMemo(() => isPriceRangeInvalid(filterState.fromInput, filterState.toInput), [filterState.fromInput, filterState.toInput]);

  return {
    // params
    sort,
    priceFrom,
    priceTo,
    sortLabel,
    // filter ui state
    filterOpen: filterState.open,
    filterError: filterState.error,
    priceFromInput: filterState.fromInput,
    priceToInput: filterState.toInput,
    rangeInvalid,
    openFilters,
    closeFilters,
    setFromInput,
    setToInput,
    applyFilters,
    clearFilters,
    // sort ui state
    sortOpen: sortState.open,
    openSort,
    closeSort,
    setSort,
  };
}

export function useProductsData({ page, sort, priceFrom, priceTo }) {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, per_page: PAGE_SIZE, from: 0, to: 0 });
  const [links, setLinks] = useState({});
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    setLoading(true);
    fetchProducts({ page, priceFrom: priceFrom || undefined, priceTo: priceTo || undefined, sort }, { signal: controller.signal })
      .then(async data => {
        if (!mounted) return;
        setProducts(data?.data || []);
        setMeta(data?.meta || {});
        setLinks(data?.links || {});

        const lastPage = parsePageFromUrl(data?.links?.last);
        if (lastPage && lastPage > 1) {
          if (page === 1) {
            const last = await fetchProducts({ page: lastPage, priceFrom: priceFrom || undefined, priceTo: priceTo || undefined, sort }, { signal: controller.signal });
            const countOnLast = Array.isArray(last?.data) ? last.data.length : 0;
            const totalExact = (lastPage - 1) * (data?.meta?.per_page || PAGE_SIZE) + countOnLast;
            setTotal(totalExact);
          }
        } else {
          if (data?.meta?.to != null) {
            setTotal(data.meta.to + (page - 1) * (data?.meta?.per_page || PAGE_SIZE));
          }
        }
      })
      .catch(err => {
        if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
          return; // ignore cancellation
        }
        // eslint-disable-next-line no-console
        console.warn('Products fetch error', err);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [page, priceFrom, priceTo, sort]);

  const pageSize = meta?.per_page || PAGE_SIZE;
  return { products, meta, links, total, loading, pageSize };
}

export function usePaginationControls(total, pageSize = PAGE_SIZE, links) {
  const { getParam, setPage } = useQueryParams();
  const page = Number(getParam('page', 1));
  const lastPageFromLinks = useMemo(() => parsePageFromUrl(links?.last), [links?.last]);
  const totalPages = useMemo(() => {
    if (lastPageFromLinks) return lastPageFromLinks;
    if (!total) return undefined;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [lastPageFromLinks, total, pageSize]);

  const pages = useMemo(() => buildPagination(page, totalPages || 1), [page, totalPages]);

  const goToPage = useCallback((p) => setPage(p), [setPage]);

  return { page, totalPages, pages, goToPage };
}


