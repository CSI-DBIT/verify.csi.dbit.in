import { refreshToken } from '@/api/auth';
import { setAccessToken } from '@/redux/features/authSlice';
import { store } from '@/redux/store';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.SERVER_BASE_URL,
  withCredentials: true, // Ensure cookies are sent
});

apiClient.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      store.dispatch(setAccessToken(newAccessToken));
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
