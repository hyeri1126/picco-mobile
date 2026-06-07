export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  wsUrl: process.env.EXPO_PUBLIC_WS_URL ?? 'http://localhost:8080',
  appName: process.env.EXPO_PUBLIC_APP_NAME ?? 'Picco',
  kakaoMapKey: process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ?? '',
  isDev: __DEV__,
  isProd: !__DEV__,
} as const;
