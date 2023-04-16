import axios from 'axios';

const Api = axios.create({
  baseURL: '/api',
});

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
