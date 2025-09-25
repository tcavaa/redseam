import React, { memo } from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const image = product?.cover_image || product?.image;
  return (
    <Link className="product-card" to={`/products/${product.id}`}>
      <div className="product-image">
        <img src={image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-price">$ {product.price}</div>
      </div>
    </Link>
  );
}

export default memo(ProductCard);


