import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCartContext } from '../../hooks/useCart.jsx';

export default function Navigation() {
  const { setOpen } = useCartContext();
  return (
    <header className="nav">
      <div className="container">
        <Link to="/" className="brand">RedSeam</Link>
        <nav className="nav-links">
          <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : undefined}>Products</NavLink>
          <button className="link" onClick={() => setOpen(true)}>Cart</button>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined}>Login</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : undefined}>Register</NavLink>
        </nav>
      </div>
    </header>
  );
}

