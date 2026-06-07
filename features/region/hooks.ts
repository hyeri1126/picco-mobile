import { useQuery } from '@tanstack/react-query';

import { regionApi } from './api';

export const useCountries = () =>
  useQuery({
    queryKey: ['countries'],
    queryFn: () => regionApi.getCountries(),
    select: ({ data }) => data,
    staleTime: 1000 * 60 * 30,
  });

export const useCitiesByCountry = (countryId: string | null) =>
  useQuery({
    queryKey: ['countries', countryId, 'cities'],
    queryFn: () => regionApi.getCitiesByCountry(countryId!),
    select: ({ data }) => data,
    enabled: countryId !== null,
    staleTime: 1000 * 60 * 30,
  });
