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
const Cart = lazy(() => import('./components/cart/Cart'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Loading from './components/ui/Loading.jsx';
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to={ROUTES.LOGIN} />;
}

function RedirectIfAuthed({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? <Navigate to={ROUTES.PRODUCTS} /> : children;
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
            <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
            <Route path={ROUTES.PRODUCT()} element={<ProductInnerPage />} />
            <Route path={ROUTES.LOGIN} element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
            <Route path={ROUTES.REGISTER} element={<RedirectIfAuthed><RegisterPage /></RedirectIfAuthed>} />
            <Route path={ROUTES.CHECKOUT} element={<RequireAuth><CheckoutPage /></RequireAuth>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
          </ErrorBoundary>
          <Suspense fallback={null}>
            <Cart />
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

