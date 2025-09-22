import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import ProductGallery from '../components/ProductGallery';
import { ColorSelector, SizeSelector } from '../components/AttributeDisplay';
import Button from '../components/ui/Button';
import { CartIconWhite } from '../components/ui';
import '../styles/ProductInner.css';
import { useCartContext } from '../hooks/useCart.jsx';
import QuantitySelect from '../components/ui/QuantitySelect.jsx';
import { mapImagesAndColors } from '../utils/productMapping';
import Loading from '../components/ui/Loading.jsx';

export default function ProductInnerPage() {
  const { id } = useParams();
  const { add } = useCartContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProductById(id)
      .then(data => {
        if (!mounted) return;
        setProduct(data);
        setActiveImage(0);
        setActiveColor(0);
        setActiveSize(0);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  // Derive pairs of image+color
  const pairs = useMemo(() => mapImagesAndColors(product), [product]);

  const images = useMemo(() => pairs.map(p => p.url), [pairs]);
  const colors = useMemo(() => pairs.map(p => p.color), [pairs]);
  const sizes = useMemo(() => (Array.isArray(product?.available_sizes) ? product.available_sizes : []), [product]);

  // Single selection handler keeps color and image in lockstep
  function selectIndex(idx) {
    setActiveImage(idx);
    setActiveColor(idx);
  }

  async function handleAddToCart() {
    if (!product) return;
    await add(product.id, {
      quantity,
      color: (colors[activeColor]?.name || colors[activeColor]?.label || '').trim().toLowerCase(),
      size: (sizes[activeSize] || '').trim().toUpperCase(),
    });
  }

  if (loading || !product) {
    return <div className="container" style={{ padding: 40 }}><Loading /></div>;
  }

  return (
    <div className="container pdp">
      <div className='pdp-top'>
        <h2>Listing / Product</h2>
      </div>
      <div className="pdp-left">
        <ProductGallery images={images} activeIndex={activeImage} onChange={selectIndex} />
      </div>
      <div className="pdp-right">
        <h1 className="pdp-title">{product.name}</h1>
        <div className="pdp-price">$ {product.price}</div>

        {colors?.length ? (
          <div className="pdp-section">
            <div className="pdp-label">Color: {colors[activeColor]?.name || ''}</div>
            <ColorSelector colors={colors} active={activeColor} onChange={selectIndex} />
          </div>
        ) : null}

        {sizes.length ? (
          <div className="pdp-section">
            <div className="pdp-label">Size: {sizes[activeSize]}</div>
            <SizeSelector sizes={sizes} active={activeSize} onChange={setActiveSize} />
          </div>
        ) : (
          <div className="pdp-section">
            <div className="pdp-label">Size</div>
            <div style={{ color: '#777' }}>No sizes available for this item</div>
          </div>
        )}

        <div className="pdp-section">
          <div className="pdp-label">Quantity</div>
          <QuantitySelect value={quantity} onChange={setQuantity} />
        </div>

        <Button className='btn btn-primary pdp-cart-button' onClick={handleAddToCart} disabled={sizes.length === 0}><img className='pdp-cart-icon-white' src={CartIconWhite} alt="Add to cart" /> Add to cart</Button>

        <hr className="pdp-sep" />

        <div className="pdp-details">
          <div className="pdp-details-header">
            <h3>Details</h3>
            <img src={product.brand.image} alt={product.brand.name} />
          </div>
          
          {product?.brand?.name ? (
            <div className="pdp-details-brand">Brand: {product.brand.name}</div>
          ) : null}
          <p className="desc">{product.description}</p>
        </div>
      </div>
    </div>
  );
}


