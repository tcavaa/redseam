export const API_BASE = import.meta.env.VITE_API_BASE_URL;
export const ROUTES = {
  ROOT: '/',
  PRODUCTS: '/products',
  PRODUCT: (id = ':id') => `/products/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
  CHECKOUT: '/checkout',
};

export const UI = {
  PAGE_SIZE: 10,
  DELIVERY_FEE: 5,
};


