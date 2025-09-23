import React, { forwardRef } from 'react';

const Button = forwardRef(function Button({ children, type = 'button', variant = 'primary', className = '', ...rest }, ref) {
  const classes = `btn btn-${variant}${className ? ' ' + className : ''}`;
  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {children}
    </button>
  );
});

export default Button;

