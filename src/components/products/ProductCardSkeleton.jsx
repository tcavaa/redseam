import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card" aria-hidden>
      <div className="skeleton-image skeleton" />
      <div className="product-info">
        <div className="skeleton-line skeleton" style={{ width: '70%', height: 18 }} />
        <div className="skeleton-line skeleton" style={{ width: 96, height: 16, marginTop: 8 }} />
      </div>
    </div>
  );
}


