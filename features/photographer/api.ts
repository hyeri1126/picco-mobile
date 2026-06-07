import { httpClient } from '@shared/api';
import type { ApiResponse, CursorPage } from '@shared/types';
import type {
  PhotographerItem, PhotographerDetailResponse,
  PortfolioPhoto, Review, SpotFolder, PhotographersQuery,
} from '@entities/photographer';

const buildQuery = (params: Record<string, string | number | boolean | undefined>) => {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return q ? `?${q}` : '';
};

export const photographerApi = {
  getList: (query: PhotographersQuery) =>
    httpClient
      .get<ApiResponse<CursorPage<PhotographerItem>>>(
        `/photographers${buildQuery(query as Record<string, string | number | boolean | undefined>)}`,
      )
      .then((r) => r.data),

  getDetail: (id: string) =>
    httpClient
      .get<ApiResponse<PhotographerDetailResponse>>(`/photographers/${id}`)
      .then((r) => r.data),

  getPhotos: (id: string, cursor?: string, size = 20) =>
    httpClient
      .get<ApiResponse<CursorPage<PortfolioPhoto>>>(
        `/photographers/${id}/photos${buildQuery({ cursor, size })}`,
      )
      .then((r) => r.data),

  getReviews: (id: string, photoOnly?: boolean, cursor?: string, size = 20) =>
    httpClient
      .get<ApiResponse<CursorPage<Review>>>(
        `/photographers/${id}/reviews${buildQuery({ photoOnly, cursor, size })}`,
      )
      .then((r) => r.data),

  getSpots: (id: string) =>
    httpClient
      .get<ApiResponse<SpotFolder[]>>(`/photographers/${id}/spots`)
      .then((r) => r.data),

  save: (photographerId: string) =>
    httpClient.post(`/saves/${photographerId}`),

  unsave: (photographerId: string) =>
    httpClient.delete(`/saves/${photographerId}`),

  likePhoto: (photoId: string) =>
    httpClient.post(`/photos/${photoId}/like`),

  unlikePhoto: (photoId: string) =>
    httpClient.delete(`/photos/${photoId}/like`),
};
