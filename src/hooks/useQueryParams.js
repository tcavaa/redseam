import { useSearchParams } from 'react-router-dom';

export function useQueryParams() {
  const [params, setParams] = useSearchParams();

  const getParam = (key, fallback = '') => params.get(key) ?? fallback;

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === '' || value == null) next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const setParamsBatch = pairs => {
    const next = new URLSearchParams(params);
    Object.entries(pairs).forEach(([key, value]) => {
      if (value === '' || value == null) next.delete(key);
      else next.set(key, value);
    });
    setParams(next);
  };

  // Helpers commonly needed by list pages: change filters/sort and reset page to 1
  const setParamAndResetPage = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === '' || value == null) next.delete(key);
    else next.set(key, value);
    next.set('page', '1');
    setParams(next);
  };

  const setParamsBatchAndResetPage = pairs => {
    const next = new URLSearchParams(params);
    Object.entries(pairs).forEach(([key, value]) => {
      if (value === '' || value == null) next.delete(key);
      else next.set(key, value);
    });
    next.set('page', '1');
    setParams(next);
  };

  const setPage = (pageNumber) => {
    const next = new URLSearchParams(params);
    next.set('page', String(pageNumber));
    setParams(next);
  };

  return {
    getParam,
    setParam,
    setParamsBatch,
    setParamAndResetPage,
    setParamsBatchAndResetPage,
    setPage,
    raw: params,
  };
}


