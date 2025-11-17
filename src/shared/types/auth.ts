export interface AuthUser {
  id: string;
  status: string;
  createdAt: string;
  profile?: {
    userId: string;
    username?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    bio?: string | null;
    locale?: string | null;
    timezone?: string | null;
    socialsJson?: string | null;
    updatedAt?: string | null;
  } | null;
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
