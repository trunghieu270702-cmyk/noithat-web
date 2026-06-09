import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' 
  ? 'https://backend-production-e6aa.up.railway.app/api/v1' 
  : 'http://localhost:3001/api/v1');

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally add interceptors for auth tokens here
apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = \`Bearer \${token}\`;
  // }
  return config;
});

export default apiClient;
