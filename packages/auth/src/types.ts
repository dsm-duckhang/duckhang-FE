export interface AuthCookieOptions {
  domain?: string
}

export interface AuthUser {
  userId: number | null
  newUser: boolean
}

export interface OAuthCallbackSession {
  accessToken: string
  userId?: number
  newUser: boolean
}

export interface AdminAuthUser {
  adminId: number | string | null
  username: string
}

export interface AdminAuthSession {
  accessToken: string
  adminId?: number | string
  username: string
}

export interface RefreshAuthOptions extends AuthCookieOptions {
  apiBaseUrl: string
}
