import React from 'react';

export default function AuthLayout({ title, children, panelClassName = '', footer }) {
  return (
    <div className="auth-layout">
      <div className="auth-hero" />
      <div className={`auth-panel${panelClassName ? ' ' + panelClassName : ''}`}>
        {title ? <h1 className="auth-title">{title}</h1> : null}
        {children}
        {footer ? footer : null}
      </div>
    </div>
  );
}


