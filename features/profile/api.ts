import { httpClient } from '@shared/api';
import type { ApiResponse } from '@shared/types';
import type { ClientProfile, PhotographerProfile } from '@entities/profile';

export interface City {
  id: string;
  countryId: string;
  nameKo: string;
  nameEn: string;
  thumbnailUrl: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CreateClientProfileRequest {
  nickname: string;
  bio?: string;
  profileImage?: string;
  interests: string[];
}

export interface UpdateClientProfileRequest {
  nickname?: string;
  bio?: string;
  profileImage?: string;
  interests?: string[];
}

export interface PortfolioPhotoInput {
  imageUrl: string;
  cityId: string;
}

export interface CreatePhotographerProfileRequest {
  nickname: string;
  bio?: string;
  profileImage?: string;
  startingPrice?: number;
  instagram?: string;
  themeIds: string[];
  cityIds: string[];
  thumbnailUrls?: string[];
  photos?: PortfolioPhotoInput[];
}

export interface UpdatePhotographerProfileRequest {
  nickname?: string;
  bio?: string;
  profileImage?: string;
  instagram?: string;
  startingPrice?: number;
  isLiveAvailable?: boolean;
  thumbnailUrls?: string[];
}

export type CurrentProfile = ClientProfile | PhotographerProfile;

export const profileApi = {
  createClient: (body: CreateClientProfileRequest) =>
    httpClient.post<ApiResponse<ClientProfile>>('/profiles/client', body).then((r) => r.data),

  updateClient: (body: UpdateClientProfileRequest) =>
    httpClient.patch<ApiResponse<ClientProfile>>('/profiles/client', body).then((r) => r.data),

  createPhotographer: (body: CreatePhotographerProfileRequest) =>
    httpClient.post<ApiResponse<PhotographerProfile>>('/profiles/photographer', body).then((r) => r.data),

  updatePhotographer: (body: UpdatePhotographerProfileRequest) =>
    httpClient.patch<ApiResponse<PhotographerProfile>>('/profiles/photographer', body).then((r) => r.data),

  getMe: () =>
    httpClient.get<ApiResponse<CurrentProfile>>('/profiles/me').then((r) => r.data),

  switchProfile: (profileType: 'CLIENT' | 'PHOTOGRAPHER') =>
    httpClient
      .patch<ApiResponse<{ currentProfileType: 'CLIENT' | 'PHOTOGRAPHER'; currentProfileId: string }>>(
        '/profiles/current',
        { profileType },
      )
      .then((r) => r.data),

  getCities: () =>
    httpClient.get<ApiResponse<City[]>>('/cities?active=true').then((r) => r.data),

  getThemes: () =>
    httpClient.get<ApiResponse<Theme[]>>('/themes').then((r) => r.data),
};
