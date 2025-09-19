import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: false,
});

// Attach Authorization header if token is present
apiClient.interceptors.request.use(config => {
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {
    // ignore storage errors
  }
  return config;
});

// Basic response error normalization
apiClient.interceptors.response.use(
  response => response,
  error => {
    const response = error?.response;
    if (response?.status === 401) {
      // Optionally clear token on 401
      // localStorage.removeItem('auth_token');
    }
    return Promise.reject(response?.data || error);
  },
);

export default apiClient;


