import { create } from 'zustand';

import { tokenStorage } from './token-storage';
import type { User } from '@entities/user';
import type { ClientProfile, PhotographerProfile } from '@entities/profile';

type CurrentProfile = ClientProfile | PhotographerProfile | null;

type AuthDestination = 'home' | 'select-type' | 'auth';

interface AuthState {
  user: User | null;
  currentProfile: CurrentProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setCurrentProfile: (profile: CurrentProfile) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<AuthDestination>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  currentProfile: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  clearAuth: () => {
    tokenStorage.clearToken();
    set({ user: null, currentProfile: null, isAuthenticated: false, isLoading: false });
  },
  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      // SecureStore → 메모리 캐시 로드 후 토큰 확인 (RN은 동기 조회 전 hydrate 필요)
      await tokenStorage.hydrate();
      const token = tokenStorage.getAccessToken();
      if (!token) {
        set({ isLoading: false });
        return 'auth';
      }

      const { authApi } = await import('@features/auth');
      const { data: user } = await authApi.me();

      set({ user, isAuthenticated: true, isLoading: false });
      return user.currentProfileId ? 'home' : 'select-type';
    } catch {
      tokenStorage.clearToken();
      set({ user: null, currentProfile: null, isAuthenticated: false, isLoading: false });
      return 'auth';
    }
  },
}));
