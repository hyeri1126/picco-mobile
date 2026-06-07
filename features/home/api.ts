import { httpClient } from '@shared/api';
import type { ApiResponse } from '@shared/types';
import type { HomeResponse } from '@entities/photographer';

export const homeApi = {
  getHome: (cityId?: string) =>
    httpClient
      .get<ApiResponse<HomeResponse>>(cityId ? `/home?cityId=${cityId}` : '/home')
      .then((r) => r.data),
};
