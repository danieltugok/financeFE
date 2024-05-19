import { getRefreshTokenService } from 'src/services/userServices';
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
} from 'axios';
import router from 'src/router';

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/',
});

http.interceptors.request.use(
  (request: any) => {
    const token = localStorage.getItem('access_token');
    const refreshToken: string | null = localStorage.getItem('refresh_token');
    const isAuthPath: boolean = request.url.includes('login') || false;
    const isRefreshPath: boolean =
      request.url.includes('refresh-token') || false;
    if (token && !isAuthPath && !isRefreshPath)
      request.headers.Authorization = `Bearer ${token}`;
    else if (refreshToken && !isAuthPath && isRefreshPath)
      request.headers['x-refresh-token'] = refreshToken;
    return request;
  },
  (error: AxiosError) => Promise.reject(error)
);
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  // (error:any) => Promise.reject(error)
  async (error: AxiosError) => {
    const originalConfig: any = error.config;
    if (originalConfig?.url !== 'login' && error) {
      if (error.response?.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const { data, status } = await getRefreshTokenService();
          if (status === 200 || status === 201) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            return http(originalConfig);
          }
        } catch (erro) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('profile');
          // router.push('signin');
          return Promise.reject(erro);
        }
      } else return Promise.reject(error);
    } else return Promise.reject(error);
  }
);

export default http;
