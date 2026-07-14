import type {
  AdminAuthSession,
  AdminAuthUser,
  AuthCookieOptions,
  AuthUser,
  OAuthCallbackSession,
} from './types'

const cookieNames = {
  accessToken: 'duckhang_access_token',
  user: 'duckhang_auth_user',
} as const

const adminCookieNames = {
  accessToken: 'duckhang_admin_access_token',
  user: 'duckhang_admin_auth_user',
} as const

const legacyCookieNames = ['duckhang_refresh_token', 'duckhang_token_type'] as const

function getCookieAttributes(options: AuthCookieOptions = {}) {
  const attributes = ['Path=/', 'SameSite=Lax']
  const domain = options.domain?.trim()

  if (domain) {
    attributes.push(`Domain=${domain}`)
  }

  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    attributes.push('Secure')
  }

  return attributes.join('; ')
}

function readCookie(name: string) {
  if (typeof document === 'undefined') {
    return null
  }

  const prefix = `${name}=`
  const cookie = document.cookie.split('; ').find((item) => item.startsWith(prefix))

  if (!cookie) {
    return null
  }

  try {
    return decodeURIComponent(cookie.slice(prefix.length))
  } catch {
    return null
  }
}

function writeCookie(name: string, value: string, options?: AuthCookieOptions) {
  document.cookie = `${name}=${encodeURIComponent(value)}; ${getCookieAttributes(options)}`
}

function removeCookie(name: string, options?: AuthCookieOptions) {
  document.cookie = `${name}=; Max-Age=0; ${getCookieAttributes(options)}`
}

function parseAuthUser(value: string | null): AuthUser | null {
  if (!value) {
    return null
  }

  try {
    const user: unknown = JSON.parse(value)

    if (
      typeof user === 'object' &&
      user !== null &&
      typeof Reflect.get(user, 'newUser') === 'boolean'
    ) {
      const userId = Reflect.get(user, 'userId')

      return {
        userId: typeof userId === 'number' ? userId : null,
        newUser: Reflect.get(user, 'newUser') as boolean,
      }
    }
  } catch {
    return null
  }

  return null
}

function parseAdminAuthUser(value: string | null): AdminAuthUser | null {
  if (!value) {
    return null
  }

  try {
    const user: unknown = JSON.parse(value)

    if (typeof user !== 'object' || user === null) {
      return null
    }

    const adminId = Reflect.get(user, 'adminId')
    const username = Reflect.get(user, 'username')

    if (
      (typeof adminId !== 'number' && typeof adminId !== 'string' && adminId !== null) ||
      typeof username !== 'string' ||
      !username
    ) {
      return null
    }

    return { adminId, username }
  } catch {
    return null
  }
}

export function getAccessToken() {
  return readCookie(cookieNames.accessToken)
}

export function isAccessTokenExpired(token = getAccessToken(), clockSkewSeconds = 30) {
  if (!token) {
    return true
  }

  const encodedPayload = token.split('.')[1]

  if (!encodedPayload) {
    return false
  }

  try {
    const payload = JSON.parse(
      atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')),
    ) as unknown
    const expiresAt =
      typeof payload === 'object' && payload !== null ? Reflect.get(payload, 'exp') : null

    return typeof expiresAt === 'number'
      ? expiresAt <= Math.floor(Date.now() / 1000) + clockSkewSeconds
      : false
  } catch {
    return false
  }
}

export function getStoredAuthUser() {
  return parseAuthUser(readCookie(cookieNames.user))
}

export function getAdminAccessToken() {
  return readCookie(adminCookieNames.accessToken)
}

export function getStoredAdminAuthUser() {
  return parseAdminAuthUser(readCookie(adminCookieNames.user))
}

export function writeAuthCookies(data: OAuthCallbackSession, options?: AuthCookieOptions) {
  const user: AuthUser = { userId: data.userId ?? null, newUser: data.newUser }

  writeCookie(cookieNames.accessToken, data.accessToken, options)
  writeCookie(cookieNames.user, JSON.stringify(user), options)
}

export function removeAuthCookies(options?: AuthCookieOptions) {
  const cookiesToRemove = [...Object.values(cookieNames), ...legacyCookieNames]
  cookiesToRemove.forEach((name) => removeCookie(name, options))
}

export function writeAdminAuthCookies(data: AdminAuthSession, options?: AuthCookieOptions) {
  const user: AdminAuthUser = {
    adminId: data.adminId ?? null,
    username: data.username,
  }

  writeCookie(adminCookieNames.accessToken, data.accessToken, options)
  writeCookie(adminCookieNames.user, JSON.stringify(user), options)
}

export function removeAdminAuthCookies(options?: AuthCookieOptions) {
  Object.values(adminCookieNames).forEach((name) => removeCookie(name, options))
}
