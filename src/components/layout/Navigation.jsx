import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCartContext } from '../../hooks/useCart.jsx';
import { logout } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth.jsx';
import logo from '../../assets/logo.png';
import { CartIcon, ChevronDown, UserIcon } from '../ui';
import { ROUTES } from '../../constants';

export default function Navigation() {
  const { setOpen } = useCartContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthed, setUser } = useAuth();
  const location = useLocation();
  const avatar = user?.profile_photo || user?.avatar;

  // Close dropdown on route change
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
  }, [location.pathname]);
  return (
    <header className="nav">
      <div className="container">
        <Link to={ROUTES.PRODUCTS} className="brand"><img className="brand-logo" src={logo} alt="RedSeam" /> RedSeam Clothing</Link>
        <nav className="nav-links">
          {isAuthed ? (
            <>
              <button className="link" onClick={() => setOpen(true)} aria-label="Cart"><img className='cart-icon' src={CartIcon} alt="Cart" /></button>
              {menuOpen ? <div className="dropdown-backdrop" onClick={() => setMenuOpen(false)} /> : null}
              <div className={`user-menu ${menuOpen ? 'open' : ''}`}>
                <button className="avatar" onClick={() => setMenuOpen(o => !o)} aria-haspopup="menu" aria-expanded={menuOpen}>
                  {avatar ? <img className='avatar-img' src={avatar} alt={user?.name || 'user'} /> : <span className="placeholder" />}
                  <img className='chevron-down' src={ChevronDown} alt="Chevron Down" />
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
              <NavLink to={ROUTES.LOGIN} className="login-container" ><img className='user-icon' src={UserIcon} alt="Cart" /> Login</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

