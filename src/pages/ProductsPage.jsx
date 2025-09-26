import React from 'react';
import ProductCard from '../components/products/ProductCard.jsx';
import '../styles/ProductsPage.css';
import Loading from '../components/ui/Loading.jsx';
import ProductCardSkeleton from '../components/products/ProductCardSkeleton.jsx';
import { UI } from '../constants';
import { useQueryParams } from '../hooks/useQueryParams';
import { useFiltersAndSort, usePaginationControls, useProductsData } from '../hooks/useProductsPage';
import Pagination from '../components/products/Pagination.jsx';
import Filters from '../components/products/Filters.jsx';

const PAGE_SIZE = UI.PAGE_SIZE;

export default function ProductsPage() {
  const { getParam } = useQueryParams();
  const page = Number(getParam('page', 1));
  const {
    sort,
    priceFrom,
    priceTo,
    sortLabel,
    filterOpen,
    filterError,
    priceFromInput,
    priceToInput,
    rangeInvalid,
    openFilters,
    closeFilters,
    setFromInput,
    setToInput,
    applyFilters,
    clearFilters,
    sortOpen,
    openSort,
    closeSort,
    setSort,
  } = useFiltersAndSort();

  const { products, meta, links, total, loading, pageSize } = useProductsData({ page, sort, priceFrom, priceTo });
  const { totalPages, pages, goToPage } = usePaginationControls(total, pageSize, links);

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
          <Filters
            filterOpen={filterOpen}
            setFilterOpen={(v) => v ? openFilters() : closeFilters()}
            sortOpen={sortOpen}
            setSortOpen={(v) => v ? openSort() : closeSort()}
            priceFromInput={priceFromInput}
            priceToInput={priceToInput}
            onFromChange={(e) => setFromInput(e.target.value)}
            onToChange={(e) => setToInput(e.target.value)}
            onApply={applyFilters}
            isInvalid={rangeInvalid}
            errorText={filterError}
            sortLabel={sortLabel}
            onSortSelect={setSort}
          />
        </div>
      </div>

      {(priceFrom || priceTo) ? (
        <div className="applied-filters">
          <span className="filter-chip">
            Price: {priceFrom || '0'}–{priceTo || '∞'}
            <button className="chip-remove" aria-label="Remove price filter" onClick={clearFilters}>×</button>
          </span>
        </div>
      ) : null}

      {loading ? (
        <div className="grid" aria-busy>
          {Array.from({ length: pageSize || PAGE_SIZE }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length == 0 ? (
        <div className="grid">
          <h1>No products found</h1>
        </div>
      ) : (
        <div className="grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        pages={pages}
        onPageChange={goToPage}
        pageSize={pageSize || PAGE_SIZE}
        currentCount={products.length}
      />
    </div>
  );
}

