import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryParams } from '../hooks/useQueryParams';
import { parsePageFromUrl, buildPagination } from '../utils/pagination';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/product/ProductCard';
import '../styles/ProductsPage.css';
import { UI } from '../constants';
import { Filters as FiltersIcon, ChevronDown, ChevronLeft, ChevronRight } from '../components/ui';
import Dropdown from '../components/ui/Dropdown.jsx';
import Loading from '../components/ui/Loading.jsx';

const PAGE_SIZE = UI.PAGE_SIZE;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getParam, setParam, setParamsBatch } = useQueryParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, per_page: PAGE_SIZE, from: 0, to: 0 });
  const [links, setLinks] = useState({});
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [priceFromInput, setPriceFromInput] = useState('');
  const [priceToInput, setPriceToInput] = useState('');
  const [filterError, setFilterError] = useState('');

  const page = Number(getParam('page', 1));
  const sort = getParam('sort', '-created_at');
  const priceFrom = getParam('price_from', '');
  const priceTo = getParam('price_to', '');

  const totalPages = useMemo(() => {
    if (!total || !meta?.per_page) return undefined;
    return Math.max(1, Math.ceil(total / meta.per_page));
  }, [total, meta]);

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

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProducts({ page, priceFrom: priceFrom || undefined, priceTo: priceTo || undefined, sort })
      .then(async data => {
        if (!mounted) return;
        setProducts(data?.data || []);
        setMeta(data?.meta || {});
        setLinks(data?.links || {});

        // Try to compute exact total using last page's real count
        const lastPage = parsePageFromUrl(data?.links?.last);
        if (lastPage && lastPage > 1) {
          // Fetch last page only when filters/sort change or first load
          if (page === 1) {
            const last = await fetchProducts({ page: lastPage, priceFrom: priceFrom || undefined, priceTo: priceTo || undefined, sort });
            const countOnLast = Array.isArray(last?.data) ? last.data.length : 0;
            const totalExact = (lastPage - 1) * (data?.meta?.per_page || PAGE_SIZE) + countOnLast;
            setTotal(totalExact);
          }
        } else {
          // Fallback approx using current page info
          if (data?.meta?.to != null) {
            setTotal(Math.max(data.meta.to + (page - 1) * (data?.meta?.per_page || PAGE_SIZE)));
          }
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [page, priceFrom, priceTo, sort]);

  const updateParam = useCallback((key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value == null) next.delete(key);
    else next.set(key, value);
    next.set('page', '1');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const updateParams = useCallback((pairs) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(pairs).forEach(([key, value]) => {
      if (value === '' || value == null) next.delete(key);
      else next.set(key, value);
    });
    next.set('page', '1');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const goToPage = useCallback((p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // When opening filter panel, seed inputs from current params
  useEffect(() => {
    if (filterOpen) {
      setPriceFromInput(priceFrom);
      setPriceToInput(priceTo);
      setFilterError('');
    }
  }, [filterOpen]);

  const onPriceFromChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setPriceFromInput(digits);
    if (filterError) setFilterError('');
  };
  const onPriceToChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setPriceToInput(digits);
    if (filterError) setFilterError('');
  };

  const isRangeInvalid = useMemo(() => {
    if (!priceFromInput || !priceToInput) return false;
    const from = Number(priceFromInput);
    const to = Number(priceToInput);
    if (Number.isNaN(from) || Number.isNaN(to)) return true;
    return from > to;
  }, [priceFromInput, priceToInput]);

  const pages = buildPagination(page, totalPages || 1);

  return (
    <div className="container products-page">
      <div className="products-header">
        <h1>Products</h1>
        <div className="products-controls">
          <div className="results-meta">
            {meta?.from != null && meta?.to != null ? (
              <span>Showing {meta.from}–{meta.to} {total ? `of ${total}` : ''} results</span>
            ) : null}
          </div>
          <div className="toolbar">
            {(filterOpen || sortOpen) ? (<div className="menu-backdrop" onClick={() => { setFilterOpen(false); setSortOpen(false); }} />) : null}
            <div className="menu">
              <Dropdown open={filterOpen} onOpenChange={(v) => { setFilterOpen(v); if (v) setSortOpen(false); }}>
                <Dropdown.Trigger>
                  <img className='filters-icon-menu' src={FiltersIcon} alt="Filters" />
                  <span>Filter</span>
                </Dropdown.Trigger>
                <Dropdown.Panel>
                  <h4>Select price</h4>
                  <div className="row long-panel">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="From *"
                      value={priceFromInput}
                      onChange={onPriceFromChange}
                      onKeyDown={(e) => { if (["e","E","+","-","."].includes(e.key)) e.preventDefault(); }}
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="To *"
                      value={priceToInput}
                      onChange={onPriceToChange}
                      onKeyDown={(e) => { if (["e","E","+","-","."].includes(e.key)) e.preventDefault(); }}
                    />
                  </div>
                  {isRangeInvalid ? <p className="error-text" style={{ marginTop: 4 }}>From must be less than or equal to To</p> : null}
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (isRangeInvalid) {
                        setFilterError('From must be less than or equal to To');
                        return;
                      }
                      setFilterError('');
                      updateParams({ 'price_from': priceFromInput, 'price_to': priceToInput });
                      setFilterOpen(false);
                    }}
                    disabled={isRangeInvalid}
                  >
                    Apply
                  </button>
                </Dropdown.Panel>
              </Dropdown>
            </div>

            <div className="menu">
              <Dropdown open={sortOpen} onOpenChange={(v) => { setSortOpen(v); if (v) setFilterOpen(false); }}>
                <Dropdown.Trigger>
                  <span>{sortLabel}</span>
                  <img className='chevron-down-menu' src={ChevronDown} alt="Chevron Down" />
                </Dropdown.Trigger>
                <Dropdown.Panel>
                  <h4 className='sort-by-title'>Sort by</h4>
                  <ul className="menu-list short-panel">
                    <li><button onClick={() => { updateParam('sort', '-created_at'); setSortOpen(false); }}>New products first</button></li>
                    <li><button onClick={() => { updateParam('sort', 'price'); setSortOpen(false); }}>Price, low to high</button></li>
                    <li><button onClick={() => { updateParam('sort', '-price'); setSortOpen(false); }}>Price, high to low</button></li>
                  </ul>
                </Dropdown.Panel>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      {(priceFrom || priceTo) ? (
        <div className="applied-filters">
          <span className="filter-chip">
            Price: {priceFrom || '0'}–{priceTo || '∞'}
            <button className="chip-remove" aria-label="Remove price filter" onClick={() => { updateParams({ 'price_from': '', 'price_to': '' }); }}>×</button>
          </span>
        </div>
      ) : null}

      {loading ? (
        <Loading style={{ padding: 40 }} />
      ) : (
        <div className="grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button className="arrow" onClick={() => goToPage(Math.max(1, page - 1))} disabled={page === 1}>
          <img src={ChevronLeft} alt="Chevron Left" />
        </button>
        <div className="pages">
          {pages.map((p, idx) =>
            p === '...'
              ? (
                <span key={`dots-${idx}`} className="dots">…</span>
              ) : (
                <button
                  key={p}
                  className={`page ${p === page ? 'active' : ''}`}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              ),
          )}
        </div>
        <button className="arrow" onClick={() => goToPage(page + 1)} disabled={totalPages ? page >= totalPages : products.length < PAGE_SIZE}>
          <img src={ChevronRight} alt="Chevron Right" />
        </button>
      </div>
    </div>
  );
}

