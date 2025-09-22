import apiClient from './client';
import { STORAGE_KEYS } from '../utils/cart';

export async function login({ email, password }) {
  const { data } = await apiClient.post('/login', { email, password });
  const token = data?.token;
  if (token) {
    localStorage.setItem('auth_token', token);
    if (data?.user) {
      try { localStorage.setItem('user', JSON.stringify(data.user)); } catch (_) {}
      // Notify in-memory auth context if present
      window.dispatchEvent(new CustomEvent('auth:user-updated'));
    }
  }
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
  
  const token = data?.token;
  if (token) {
    localStorage.setItem('auth_token', token);
    if (data?.user) {
      try { localStorage.setItem('user', JSON.stringify(data.user)); } catch (_) {}
      window.dispatchEvent(new CustomEvent('auth:user-updated'));
    }
  }
  return data;
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
  window.dispatchEvent(new CustomEvent('auth:user-updated'));
}

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}


