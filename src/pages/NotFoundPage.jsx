import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

export default function NotFoundPage({ message = 'Page not found' }) {
  return (
    <div className="container" style={{ padding: 80, textAlign: 'center' }}>
      <h1 style={{ margin: 0, fontSize: 42 }}>404</h1>
      <p style={{ color: '#3E424A', marginTop: 8 }}>{message}</p>
      <div style={{ marginTop: 24 }}>
        <Link className="btn btn-primary" to={ROUTES.PRODUCTS} style={{ display: 'inline-block', width: 214, textDecoration: 'none' }}>
          Go to products
        </Link>
      </div>
    </div>
  );
}
