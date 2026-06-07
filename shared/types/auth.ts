export interface TokenPair {
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export type ProfileType = 'CLIENT' | 'PHOTOGRAPHER';
