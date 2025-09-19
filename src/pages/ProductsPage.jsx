import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/product/ProductCard';
import '../styles/ProductsPage.css';

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

  const page = Number(searchParams.get('page') || 1);
  const sort = searchParams.get('sort') || '-created_at';
  const priceFrom = searchParams.get('price_from') || '';
  const priceTo = searchParams.get('price_to') || '';

  const totalPages = useMemo(() => {
    if (!total || !meta?.per_page) return undefined;
    return Math.max(1, Math.ceil(total / meta.per_page));
  }, [total, meta]);

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

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value == null) next.delete(key);
    else next.set(key, value);
    next.set('page', '1');
    setSearchParams(next);
  }

  function goToPage(p) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  }

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
            <form className="filters" onSubmit={e => e.preventDefault()}>
              <span className="icon">⚙️</span>
              <span className="label">Filter</span>
              <input
                type="number"
                placeholder="Price from"
                value={priceFrom}
                onChange={e => updateParam('price_from', e.target.value)}
              />
              <input
                type="number"
                placeholder="Price to"
                value={priceTo}
                onChange={e => updateParam('price_to', e.target.value)}
              />
            </form>
            <div className="sort">
              <span className="label">Sort by</span>
              <select value={sort} onChange={e => updateParam('sort', e.target.value)}>
                <option value="-created_at">New products first</option>
                <option value="price">Price, low to high</option>
                <option value="-price">Price, high to low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

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
          ‹
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
          ›
        </button>
      </div>
    </div>
  );
}

