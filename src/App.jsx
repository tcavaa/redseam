import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import ProductsPage from './pages/ProductsPage';
import ProductInnerPage from './pages/ProductInnerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/App.css';
import { CartProvider } from './hooks/useCart.jsx';
import Cart from './components/cart/Cart';
import CheckoutPage from './pages/CheckoutPage.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';

function RequireAuth({ children }) {
  const authed = !!localStorage.getItem('auth_token');
  return authed ? children : <Navigate to="/login" />;
}

function RedirectIfAuthed({ children }) {
  const authed = !!localStorage.getItem('auth_token');
  return authed ? <Navigate to="/products" /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navigation />
          <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/products" element={<RequireAuth><ProductsPage /></RequireAuth>} />
          <Route path="/products/:id" element={<RequireAuth><ProductInnerPage /></RequireAuth>} />
          <Route path="/login" element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
          <Route path="/register" element={<RedirectIfAuthed><RegisterPage /></RedirectIfAuthed>} />
          <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
          </Routes>
          <Cart />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

