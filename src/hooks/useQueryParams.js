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

  return { getParam, setParam, setParamsBatch, raw: params };
}


