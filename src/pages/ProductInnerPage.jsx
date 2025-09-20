import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import ProductGallery from '../components/ProductGallery';
import { ColorSelector, SizeSelector } from '../components/AttributeDisplay';
import Button from '../components/ui/Button';
import { CartIconWhite } from '../components/ui';
import '../styles/ProductInner.css';
import { addToCart } from '../api/cart';
import { useCartContext } from '../hooks/useCart.jsx';

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

  // Derive pairs of image+color from multiple possible API shapes
  function colorNameToHex(name) {
    if (!name) return '#e6e6e6';
    const n = String(name).trim().toLowerCase();
    const map = {
      black: '#000000',
      white: '#f0efeb',
      'navy blue': '#1f2a44',
      navy: '#001f3f',
      blue: '#1976d2',
      green: '#2e7d32',
      red: '#d32f2f',
      yellow: '#fbc02d',
      beige: '#f5f0e1',
      brown: '#8d6e63',
      purple: '#7b1fa2',
      peach: '#ffe5b4',
      lavender: '#c3b1e1',
      pink: '#ec407a',
      'baby pink': '#f1d9df',
      orange: '#fb8c00',
      gray: '#9e9e9e',
      grey: '#9e9e9e',
    };
    if (map[n]) return map[n];
    // Try CSS named colors as fallback
    const test = document.createElement('div');
    test.style.color = name;
    return test.style.color ? name : '#e6e6e6';
  }

  const pairs = useMemo(() => {
    if (!product) return [];
    // Shape A: images: [{ url, color: { name, hex } }]
    if (Array.isArray(product.images) && product.images.length && typeof product.images[0] === 'object') {
      return product.images.map(it => ({
        url: it.url || it.src || it.image || it,
        color: it.color || { name: it.color_name, hex: it.color_hex },
      }));
    }
    // Shape B: images: string[], available_colors: string[] mapped by index
    if (Array.isArray(product.images) && Array.isArray(product.available_colors) && product.available_colors.length) {
      const imgs = product.images;
      const cols = product.available_colors;
      const len = Math.min(imgs.length, cols.length);
      const list = [];
      for (let i = 0; i < len; i++) {
        const colName = cols[i];
        list.push({ url: imgs[i], color: { name: colName, hex: colorNameToHex(colName) } });
      }
      return list;
    }
    // Shape C: only images available
    const imgs = product.images || (product.cover_image ? [product.cover_image] : []);
    return imgs.map((url, idx) => ({ url, color: { name: `Image ${idx + 1}`, hex: '#eee' } }));
  }, [product]);

  const images = useMemo(() => pairs.map(p => p.url), [pairs]);
  const colors = useMemo(() => pairs.map(p => p.color), [pairs]);
  const sizes = useMemo(() => product?.sizes || ['XS', 'S', 'M', 'L', 'XL'], [product]);

  // Single selection handler keeps color and image in lockstep
  function selectIndex(idx) {
    setActiveImage(idx);
    setActiveColor(idx);
  }

  async function handleAddToCart() {
    if (!product) return;
    await add(product.id, {
      quantity,
      color: colors[activeColor]?.name || colors[activeColor]?.label || '',
      size: sizes[activeSize],
    });
  }

  if (loading || !product) {
    return <div className="container" style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div className="container pdp">
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

        <div className="pdp-section">
          <div className="pdp-label">Size: {sizes[activeSize]}</div>
          <SizeSelector sizes={sizes} active={activeSize} onChange={setActiveSize} />
        </div>

        <div className="pdp-section">
          <div className="pdp-label">Quantity</div>
          <div className="qty-select">
            <select className="qty" value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
              {[1,2,3,4,5].map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
        </div>

        <Button className='btn btn-primary pdp-cart-button' onClick={handleAddToCart}><img className='pdp-cart-icon-white' src={CartIconWhite} alt="Add to cart" /> Add to cart</Button>

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


