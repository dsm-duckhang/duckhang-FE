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

export interface RefreshAuthOptions extends AuthCookieOptions {
  apiBaseUrl: string
}
