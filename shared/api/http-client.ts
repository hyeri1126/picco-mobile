import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { env } from '@shared/config';
import { tokenStorage } from '@shared/auth';

// 401 발생 시 실행할 핸들러. 라우팅은 RN(expo-router)을 아는 app 레이어에서 등록한다.
// (웹 버전의 window.location.replace('/auth') 대체)
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  unauthorizedHandler = handler;
};

const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        tokenStorage.clearToken();
        unauthorizedHandler?.();
      }
      return Promise.reject(error);
    },
  );

  return client;
};

export const httpClient = createHttpClient();
