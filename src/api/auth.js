import apiClient from './client';
import { STORAGE_KEYS } from '../utils/cart';

export async function login({ email, password }) {
  const { data } = await apiClient.post('/login', { email, password });
  return data;
}

export async function register({ username, email, password, passwordConfirmation, avatar }) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('password_confirmation', passwordConfirmation);
  if (avatar instanceof File) {
    formData.append('avatar', avatar, avatar.name);
  } else if (avatar && typeof avatar === 'object' && 'length' in avatar && avatar.length > 0) {
    const file = avatar[0];
    if (file instanceof File) {
      formData.append('avatar', file, file.name);
    }
  }
  const { data } = await apiClient.post('/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
}

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}


