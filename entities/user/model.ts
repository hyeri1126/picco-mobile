export interface User {
  id: string;
  email: string | null;
  currentProfileType: 'CLIENT' | 'PHOTOGRAPHER' | null;
  currentProfileId: string | null;
  hasClientProfile: boolean;
  hasPhotographerProfile: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  provider: 'KAKAO' | 'GOOGLE' | 'EMAIL';
  providerAccountId: string;
}
