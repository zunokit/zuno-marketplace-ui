export interface AuthUser {
  id: string;
  status: string;
  createdAt: string;
  profile?: {
    userId: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    bio?: string;
    locale?: string;
    timezone?: string;
    socialsJson?: string;
    updatedAt?: string;
  };
}

export interface NonceResponse {
  nonce: string;
  expiresAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  address: string;
  chainId: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
}

export interface SiweMessage {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
  expirationTime?: string;
  notBefore?: string;
  requestId?: string;
  resources?: string[];
}
