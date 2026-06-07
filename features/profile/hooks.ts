import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@shared/auth';
import { ROUTES, href } from '@shared/config';
import {
  profileApi,
  type CreateClientProfileRequest,
  type CreatePhotographerProfileRequest,
} from './api';

export const useCreateClientProfile = () => {
  const { setCurrentProfile } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: CreateClientProfileRequest) => profileApi.createClient(body),
    onSuccess: ({ data }) => {
      setCurrentProfile(data);
      router.replace(href(ROUTES.profileComplete));
    },
  });
};

export const useCreatePhotographerProfile = () => {
  const { setCurrentProfile } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: CreatePhotographerProfileRequest) => profileApi.createPhotographer(body),
    onSuccess: ({ data }) => {
      setCurrentProfile(data);
      router.replace(href(ROUTES.home));
    },
  });
};

export const useMyProfile = () => {
  const { setCurrentProfile, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => profileApi.getMe(),
    enabled: isAuthenticated,
    select: ({ data }) => {
      setCurrentProfile(data);
      return data;
    },
  });
};

export const useCities = () =>
  useQuery({
    queryKey: ['cities'],
    queryFn: () => profileApi.getCities(),
    select: ({ data }) => data,
    staleTime: 1000 * 60 * 10,
  });

export const useThemes = () =>
  useQuery({
    queryKey: ['themes'],
    queryFn: () => profileApi.getThemes(),
    select: ({ data }) => data,
    staleTime: 1000 * 60 * 10,
  });
