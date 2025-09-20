import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/product/ProductCard';
import '../styles/ProductsPage.css';
import { Filters as FiltersIcon, ChevronDown, ChevronLeft, ChevronRight } from '../components/ui';

const PAGE_SIZE = 10;

function parsePageFromUrl(url) {
  try {
    const u = new URL(url);
    const p = u.searchParams.get('page');
    return p ? Number(p) : undefined;
  } catch (_) {
    return undefined;
  }
}

function buildPagination(current, total) {
  const pages = [];
  if (!total || total <= 1) return [1];
  const add = p => pages.push(p);
  const show = (p) => p >= 1 && p <= total;
  add(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('...');
  for (let p = start; p <= end; p++) add(p);
  if (end < total - 1) pages.push('...');
  if (total > 1) add(total);
  return pages;
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, per_page: PAGE_SIZE, from: 0, to: 0 });
  const [links, setLinks] = useState({});
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [priceFromInput, setPriceFromInput] = useState('');
  const [priceToInput, setPriceToInput] = useState('');

  const page = Number(searchParams.get('page') || 1);
  const sort = searchParams.get('sort') || '-created_at';
  const priceFrom = searchParams.get('price_from') || '';
  const priceTo = searchParams.get('price_to') || '';

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
    }
  }, [filterOpen]);

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
            <div className="menu">
              <button className="menu-trigger" onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}>
                <img className='filters-icon-menu' src={FiltersIcon} alt="Filters" />
                <span>Filter</span>
              </button>
              {filterOpen ? (
                <div className="menu-panel">
                  <h4>Select price</h4>
                  <div className="row">
                    <input type="number" placeholder="From *" value={priceFromInput} onChange={e => setPriceFromInput(e.target.value)} />
                    <input type="number" placeholder="To *" value={priceToInput} onChange={e => setPriceToInput(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" onClick={() => { updateParams({ 'price_from': priceFromInput, 'price_to': priceToInput }); setFilterOpen(false); }}>Apply</button>
                </div>
              ) : null}
            </div>

            <div className="menu">
              <button className="menu-trigger" onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }}>
                <span>{sortLabel}</span>
                <img className='chevron-down-menu' src={ChevronDown} alt="Chevron Down" />
              </button>
              {sortOpen ? (
                <div className="menu-panel short-panel">
                  <h4 className='sort-by-title'>Sort by</h4>
                  <ul className="menu-list">
                    <li><button onClick={() => { updateParam('sort', '-created_at'); setSortOpen(false); }}>New products first</button></li>
                    <li><button onClick={() => { updateParam('sort', 'price'); setSortOpen(false); }}>Price, low to high</button></li>
                    <li><button onClick={() => { updateParam('sort', '-price'); setSortOpen(false); }}>Price, high to low</button></li>
                  </ul>
                </div>
              ) : null}
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
        <div className="loading">Loading...</div>
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

