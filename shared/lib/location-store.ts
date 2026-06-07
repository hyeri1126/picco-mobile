import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CityDetail } from '@entities/photographer';

interface LocationState {
  city: CityDetail | null;
  setCity: (city: CityDetail) => void;
  clearCity: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: null,
      setCity: (city) => set({ city }),
      clearCity: () => set({ city: null }),
    }),
    {
      name: 'picco_location',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
