import React from 'react';

export function ColorSelector({ colors = [], active, onChange }) {
  return (
    <div className="color-selector">
      {colors.map((c, idx) => {
        const style = c?.image
          ? { background: `url(${c.image}) center/cover no-repeat` }
          : { backgroundColor: c?.hex || c };
        return (
          <button
            key={c?.name || c?.hex || String(idx)}
            className={`color-swatch ${active === idx ? 'active' : ''}`}
            style={style}
            onClick={() => onChange && onChange(idx)}
            title={(c && c.name) || ''}
          />
        );
      })}
    </div>
  );
}

export function SizeSelector({ sizes = [], active, onChange }) {
  return (
    <div className="size-selector">
      {sizes.map((s, idx) => (
        <button
          key={`${s}-${idx}`}
          className={`size-chip ${active === idx ? 'active' : ''}`}
          onClick={() => onChange && onChange(idx)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export default function AttributeDisplay() {
  return null;
}

