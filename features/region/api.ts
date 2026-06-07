import { httpClient } from '@shared/api';
import type { ApiResponse } from '@shared/types';
import type { Country, CityDetail } from '@entities/photographer';

export const regionApi = {
  getCountries: () =>
    httpClient.get<ApiResponse<Country[]>>('/countries').then((r) => r.data),

  getCitiesByCountry: (countryId: string) =>
    httpClient
      .get<ApiResponse<CityDetail[]>>(`/countries/${countryId}/cities`)
      .then((r) => r.data),
};
