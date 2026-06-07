import * as SecureStore from 'expo-secure-store';

interface ITokenStorage {
  /** 메모리 캐시에서 동기 조회 (앱 시작 시 hydrate 선행 필요) */
  getAccessToken: () => string | null;
  setToken: (accessToken: string) => void;
  clearToken: () => void;
  /** SecureStore → 메모리 캐시 로드. 앱 부팅 시 1회 호출 */
  hydrate: () => Promise<void>;
}

const ACCESS_TOKEN_KEY = 'picco_access_token';

// httpClient/socket 인터셉터가 토큰을 동기로 읽을 수 있도록 메모리에 캐시한다.
// SecureStore 읽기는 async라 부팅 시 hydrate()로 한 번 메모리에 올린 뒤 사용.
let cachedToken: string | null = null;

const createSecureTokenStorage = (): ITokenStorage => ({
  getAccessToken: () => cachedToken,
  setToken: (accessToken) => {
    cachedToken = accessToken;
    // write-through (실패해도 메모리 캐시는 유효)
    void SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  },
  clearToken: () => {
    cachedToken = null;
    void SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },
  hydrate: async () => {
    cachedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
});

export const tokenStorage: ITokenStorage = createSecureTokenStorage();
