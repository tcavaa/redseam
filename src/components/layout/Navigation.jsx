import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <header className="nav">
      <div className="container">
        <Link to="/" className="brand">RedSeam</Link>
        <nav className="nav-links">
          <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : undefined}>Products</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : undefined}>Cart</NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined}>Login</NavLink>
        </nav>
      </div>
    </header>
  );
}

