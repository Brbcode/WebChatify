import axios from 'axios';
import User from './utils/User';

const Api = axios.create({
  baseURL: '/api',
});

Api.interceptors.request.use(
  (config) => {
    const token = User.getToken();
    const processedConfig = { ...config };
    if (token) {
      processedConfig.headers.Authorization = `Bearer ${token}`;
    }

    return processedConfig;
  },
  (error) => Promise.reject(error),
);

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      window.dispatchEvent(new CustomEvent('notification', {
        detail: {
          severity: 'error',
          message: error.response.data.message,
        },
      }));

      if (error.response.data.message === 'Session has expired') {
        User.logout();
      }
    } else if (error.request) {
      window.dispatchEvent(new CustomEvent('notification', {
        detail: {
          severity: 'error',
          message: 'Timeout. Check your internet connection',
        },
      }));
      console.log('No response received:', error.request);
    } else {
      window.dispatchEvent(new Event('notification', {
        severity: 'error',
        message: 'Unexpected error occurred',
      }));
      console.log('Error message:', error.message);
    }
    return Promise.reject(error);
  },
);

export default Api;
