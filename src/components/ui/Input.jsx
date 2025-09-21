import React from 'react';

export default function Input({
  label,
  type = 'text',
  name,
  register,
  required = false,
  error,
  rightIcon,
  onRightIconClick,
  variant = 'infield', // 'infield' | 'top'
  ...rest
}) {
  const inputProps = register ? register(name) : {};
  const baseInput = (
    <input
      id={name}
      name={name}
      type={type}
      aria-label={label}
      placeholder={variant === 'infield' ? ' ' : undefined}
      className={`input ${variant === 'infield' ? 'input-infield' : ''} ${error ? 'input-error' : ''}`}
      {...inputProps}
      {...rest}
    />
  );

  if (variant === 'top') {
    return (
      <div className="form-control">
        {label ? (
          <label className="form-label" htmlFor={name}>
            {label} {required ? <span className="required">*</span> : null}
          </label>
        ) : null}
        <div className="input-wrapper">
          {baseInput}
          {rightIcon ? (
            <button type="button" className="input-icon" onClick={onRightIconClick}>
              {rightIcon}
            </button>
          ) : null}
        </div>
        {error ? <p className="error-text">{error}</p> : null}
      </div>
    );
  }

  // Infield label variant (label rendered inside the input, placeholders avoided)
  return (
    <div className="form-control infield">
      <div className="input-wrapper">
        {baseInput}
        <span className="infield-label">
          {label} {required ? <span className="required">*</span> : null}
        </span>
        {rightIcon ? (
          <button type="button" className="input-icon" onClick={onRightIconClick}>
            {rightIcon}
          </button>
        ) : null}
      </div>
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
}


