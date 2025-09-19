import apiClient from './client';

export async function login({ email, password }) {
  const { data } = await apiClient.post('/login', { email, password });
  const token = data?.token;
  if (token) {
    localStorage.setItem('auth_token', token);
  }
  return data;
}

export async function register({ username, email, password, passwordConfirmation, avatar }) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('password_confirmation', passwordConfirmation);
  if (avatar) {
    formData.append('avatar', avatar);
  }
  const { data } = await apiClient.post('/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const token = data?.token;
  if (token) {
    localStorage.setItem('auth_token', token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem('auth_token');
}

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}


