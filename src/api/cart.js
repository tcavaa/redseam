import apiClient from './client';

export async function getCart() {
  const { data } = await apiClient.get('/cart');
  return data;
}

export async function addToCart(productId, { quantity = 1, color, size } = {}) {
  const { data } = await apiClient.post(`/cart/products/${productId}`, {
    quantity,
    color,
    size,
  });
  return data;
}

export async function updateCartItem(productId, { quantity }) {
  const { data } = await apiClient.patch(`/cart/products/${productId}`, { quantity });
  return data;
}

export async function removeFromCart(productId) {
  await apiClient.delete(`/cart/products/${productId}`);
}

export async function checkout({ email, name, surname, zipCode, address }) {
  const { data } = await apiClient.post('/cart/checkout', {
    email,
    name,
    surname,
    zip_code: zipCode,
    address,
  });
  return data;
}


