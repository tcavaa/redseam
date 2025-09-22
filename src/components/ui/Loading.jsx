import React from 'react';

export default function Loading({ label = 'Loading...', className = '', style, size = 24 }) {
  return (
    <div
      className={`loading${className ? ' ' + className : ''}`}
      style={style}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="spinner" style={{ width: size, height: size }} aria-hidden="true" />
      {label ? <span className="loading-label">{label}</span> : null}
    </div>
  );
}
