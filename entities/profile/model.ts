export interface ClientProfile {
  id: string;
  userId: string;
  nickname: string;
  bio: string | null;
  profileImage: string | null;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PhotographerProfile {
  id: string;
  userId: string;
  nickname: string;
  bio: string | null;
  profileImage: string | null;
  instagram: string | null;
  startingPrice: number | null;
  ratingAvg: number;
  reviewCount: number;
  saveCount: number;
  postCount: number;
  isLiveAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
