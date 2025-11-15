export interface AuthUser {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isEmailVerified?: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  lastActive: string;
  expiresAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface NonceResponse {
  nonce: string;
  expiresAt: string;
}

export interface VerifySiweResponse {
  success: boolean;
  user: AuthUser;
  accessToken: string;
  // refreshToken is set as HTTP-only cookie
}

export interface RefreshSessionResponse {
  success: boolean;
  accessToken: string;
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
