import React from 'react';

export default function QuantitySelect({ value, onChange, min = 1, max = 5 }) {
  const options = [];
  for (let i = min; i <= max; i++) options.push(i);
  return (
    <div className="qty-select">
      <select className="qty" value={value} onChange={e => onChange(Number(e.target.value))}>
        {options.map(q => <option key={q} value={q}>{q}</option>)}
      </select>
    </div>
  );
}


