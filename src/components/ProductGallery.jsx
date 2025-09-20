import React from 'react';

export default function ProductGallery({ images = [], activeIndex = 0, onChange }) {
  const active = Math.min(Math.max(activeIndex, 0), images.length - 1);
  return (
    <div className="pdp-gallery">
      <div className="thumbs">
        {images.map((src, idx) => (
          <button
            key={idx}
            className={`thumb ${idx === active ? 'active' : ''}`}
            onClick={() => onChange && onChange(idx)}
          >
            <img src={src} alt={`thumb-${idx}`} />
          </button>
        ))}
      </div>
      <div className="main">
        {images[active] ? <img src={images[active]} alt={`image-${active}`} /> : null}
      </div>
    </div>
  );
}

