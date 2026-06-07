import { useQuery } from '@tanstack/react-query';

import { homeApi } from './api';

export const useHomeData = (cityId?: string) =>
  useQuery({
    queryKey: ['home', cityId ?? null],
    queryFn: () => homeApi.getHome(cityId),
    select: ({ data }) => data,
    staleTime: 1000 * 60 * 3,
  });
