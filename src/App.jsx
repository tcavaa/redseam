import React, { Suspense, lazy } from 'react';
import { ROUTES } from './constants';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/layout/Navigation';

const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductInnerPage = lazy(() => import('./pages/ProductInnerPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
import './styles/App.css';
import { CartProvider } from './hooks/useCart.jsx';
import Cart from './components/cart/Cart';
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import Loading from './components/ui/Loading.jsx';

function RequireAuth({ children }) {
  const authed = !!localStorage.getItem('auth_token');
  return authed ? children : <Navigate to={ROUTES.LOGIN} />;
}

function RedirectIfAuthed({ children }) {
  const authed = !!localStorage.getItem('auth_token');
  return authed ? <Navigate to={ROUTES.PRODUCTS} /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navigation />
          <ErrorBoundary>
          <Suspense fallback={<Loading style={{ padding: 40 }} />}>
          <Routes>
            <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.PRODUCTS} />} />
            <Route path={ROUTES.PRODUCTS} element={<RequireAuth><ProductsPage /></RequireAuth>} />
            <Route path={ROUTES.PRODUCT()} element={<RequireAuth><ProductInnerPage /></RequireAuth>} />
            <Route path={ROUTES.LOGIN} element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
            <Route path={ROUTES.REGISTER} element={<RedirectIfAuthed><RegisterPage /></RedirectIfAuthed>} />
            <Route path={ROUTES.CHECKOUT} element={<RequireAuth><CheckoutPage /></RequireAuth>} />
          </Routes>
          </Suspense>
          </ErrorBoundary>
          <Cart />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

