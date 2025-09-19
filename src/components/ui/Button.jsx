import React from 'react';

export default function Button({ children, type = 'button', variant = 'primary', ...rest }) {
  return (
    <button type={type} className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
}

