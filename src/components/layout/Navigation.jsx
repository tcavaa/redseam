import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCartContext } from '../../hooks/useCart.jsx';
import { logout } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function Navigation() {
  const { setOpen } = useCartContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthed, setUser } = useAuth();
  const avatar = user?.profile_photo || user?.avatar;
  return (
    <header className="nav">
      <div className="container">
        <Link to="/products" className="brand">RedSeam</Link>
        <nav className="nav-links">
          {isAuthed ? (
            <>
              <button className="link" onClick={() => setOpen(true)} aria-label="Cart">🛒</button>
              <div className={`user-menu ${menuOpen ? 'open' : ''}`}>
                <button className="avatar" onClick={() => setMenuOpen(o => !o)} aria-haspopup="menu" aria-expanded={menuOpen}>
                  {avatar ? <img src={avatar} alt={user?.name || 'user'} /> : <span className="placeholder" />}
                </button>
                <div className="dropdown">
                  <div className="user-row">
                    {avatar ? <img src={avatar} alt={user?.name || 'user'} /> : <span className="placeholder" />}
                    <div className="user-info">
                      <div className="name">{user?.name || user?.username}</div>
                      <div className="email">{user?.email}</div>
                    </div>
                  </div>
                  <button className="logout" onClick={() => { logout(); setUser(null); window.location.href = '/'; }}>Log out</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined}>Login</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

