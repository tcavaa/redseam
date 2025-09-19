import React from 'react';

export default function Input({
  label,
  type = 'text',
  name,
  register,
  required = false,
  error,
  placeholder,
  rightIcon,
  onRightIconClick,
  ...rest
}) {
  return (
    <div className="form-control">
      {label ? (
        <label className="form-label" htmlFor={name}>
          {label} {required ? <span className="required">*</span> : null}
        </label>
      ) : null}
      <div className="input-wrapper">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`input ${error ? 'input-error' : ''}`}
          {...(register ? register(name) : {})}
          {...rest}
        />
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


