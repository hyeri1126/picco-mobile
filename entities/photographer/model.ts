// ─── Section-based Home ──────────────────────────────────────────

export type SectionType = 'city' | 'photo' | 'album' | 'photographer';
export type SectionLayout = 'carousel' | 'masonry' | 'list';
export type SectionVariant = 'ranked' | 'mini' | null;

export interface SeeMore {
  endpoint: string;
  params: Record<string, string>;
}

export interface HomeSection {
  key: string;
  type: SectionType;
  title: string;
  subtitle: string | null;
  layout: SectionLayout;
  variant: SectionVariant;
  seeMore: SeeMore | null;
  items: CityItem[] | PhotoItem[] | AlbumItem[] | PhotographerItem[];
}

export interface HomeLocation {
  cityId: string;
  nameKo: string;
  nameEn: string;
}

export interface HomeResponse {
  location: HomeLocation | null;
  sections: HomeSection[];
}

// ─── Section Item Types ───────────────────────────────────────────

export interface CityItem {
  id: string;
  nameKo: string;
  nameEn: string;
  thumbnailUrl: string | null;
  photographerCount: number;
}

export interface PhotoItem {
  id: string;
  imageUrl: string;
  likeCount: number;
  liked: boolean; // 비로그인 시 false
  photographer: { id: string; nickname: string }; // profileImage 없음
  city: { id: string; nameKo: string };
  spot: { id: string; nameKo: string } | null;
}

export interface AlbumItem {
  id: string;
  title: string;
  coverImageUrl: string | null;
  likeCount: number;
  spot: { id: string; nameKo: string } | null;
  photographer: { id: string; nickname: string };
}

// ─── Photographer Item (홈/목록 카드용) ───────────────────────────

export interface PhotographerItem {
  id: string;
  nickname: string;
  profileImage: string | null;
  thumbnails: string[]; // 대표 작품컷 1~3장
  ratingAvg: number;
  reviewCount: number;
  saveCount: number;
  saved: boolean; // 비로그인 시 false
  startingPrice: number | null;
  isLiveAvailable: boolean;
  themes: string[];
  rank: number | null; // ranked variant만, 나머지 null
  weeklyBookingCount: null; // 예약 미구현, 항상 null
}

// ─── Photographer Detail ──────────────────────────────────────────

export interface PhotographerAlbumSummary {
  id: string;
  title: string;
  coverImageUrl: string | null;
  likeCount: number;
  photoCount: number;
}

export interface PhotographerDetailResponse {
  id: string;
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
  saved: boolean;
  themes: string[];
  cities: { id: string; nameKo: string }[];
  albums: PhotographerAlbumSummary[];
}

// ─── Photos Tab (/photographers/:id/photos) ───────────────────────

export interface PortfolioPhoto {
  id: string;
  imageUrl: string;
  cityId: string;
  spotId: string | null;
  likeCount: number;
  albumId: string;
  photographerId: string;
}

// ─── Reviews Tab (/photographers/:id/reviews) ─────────────────────

export interface Review {
  id: string;
  clientNickname: string;
  clientProfileImage: string | null;
  rating: number;
  content: string | null;
  images: string[]; // 포토 리뷰 이미지 URL 배열
  createdAt: string;
}

// ─── Spots Tab (/photographers/:id/spots) ─────────────────────────

export interface SpotFolder {
  spotId: string;
  spotNameKo: string;
  spotNameEn: string;
  photos: PortfolioPhoto[];
}

// ─── Photographer List ────────────────────────────────────────────

export interface PhotographersQuery {
  cityId?: string;
  q?: string;
  sort?: 'recommended' | 'rating' | 'reviews' | 'priceAsc' | 'hot' | 'new';
  priceMin?: number;
  priceMax?: number;
  availableNow?: boolean;
  themeId?: string;
  cursor?: string;
  size?: number;
}

// ─── Country / City ───────────────────────────────────────────────

export interface Country {
  id: string;
  code: string;
  nameKo: string;
  nameEn: string;
}

export interface CityDetail {
  id: string;
  countryId: string;
  nameKo: string;
  nameEn: string;
  thumbnailUrl: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}
