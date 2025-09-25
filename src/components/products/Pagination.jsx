import React from 'react';
import { ChevronLeft, ChevronRight } from '../ui';

export default function Pagination({ page, totalPages, pages, onPageChange, pageSize, currentCount }) {
  const canGoNext = totalPages ? page < totalPages : (currentCount ?? 0) >= (pageSize ?? 10);
  return (
    <div className="pagination">
      <button className="arrow" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
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
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            ),
        )}
      </div>
      <button className="arrow" onClick={() => onPageChange(page + 1)} disabled={!canGoNext}>
        <img src={ChevronRight} alt="Chevron Right" />
      </button>
    </div>
  );
}


