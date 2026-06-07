export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface Match {
  id: string;
  clientId: string;
  photographerId: string;
  status: MatchStatus;
  scheduledAt: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  price: number;
  createdAt: string;
}
