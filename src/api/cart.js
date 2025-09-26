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

export async function updateCartItem(productId, { quantity, color, size } = {}) {
  const { data } = await apiClient.patch(`/cart/products/${productId}`, { quantity, color, size });
  return data;
}

export async function removeFromCart(productId, { color, size } = {}) {
  // Send variant to disambiguate which item to remove when multiple variants exist
  await apiClient.delete(`/cart/products/${productId}`, { data: { color, size } });
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


