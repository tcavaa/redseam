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

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductInnerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <Cart />
      </CartProvider>
    </BrowserRouter>
  );
}

