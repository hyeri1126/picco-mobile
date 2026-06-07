import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { tokenStorage, useAuthStore } from '@shared/auth';
import { ROUTES, href } from '@shared/config';
import { authApi, type EmailLoginRequest, type EmailSignupRequest } from './api';

const redirectAfterAuth = (
  user: { currentProfileId: string | null },
  router: ReturnType<typeof useRouter>,
) => {
  if (user.currentProfileId) {
    router.replace(href(ROUTES.home));
  } else {
    router.replace(href(ROUTES.selectType));
  }
};

export const useEmailLogin = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: EmailLoginRequest) => authApi.emailLogin(body),
    onSuccess: ({ data }) => {
      tokenStorage.setToken(data.tokens.accessToken);
      setUser(data.user);
      redirectAfterAuth(data.user, router);
    },
  });
};

export const useEmailSignup = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: EmailSignupRequest) => authApi.emailSignup(body),
    onSuccess: ({ data }) => {
      tokenStorage.setToken(data.tokens.accessToken);
      setUser(data.user);
      router.replace(href(ROUTES.selectType));
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
      router.replace(href(ROUTES.auth));
    },
  });
};

export const useMe = () => {
  const { setUser, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me(),
    enabled: !!tokenStorage.getAccessToken() && !isAuthenticated,
    select: ({ data }) => {
      setUser(data);
      return data;
    },
  });
};
