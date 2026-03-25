import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// For compatibility with the user's request for process.env.REACT_APP_API_URL
// We'll use a fallback and export it.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
