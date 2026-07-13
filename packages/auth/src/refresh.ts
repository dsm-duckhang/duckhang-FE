import { setAuthSession } from './store'
import type { OAuthCallbackSession, RefreshAuthOptions } from './types'

interface RefreshResponse {
  success: boolean
  data: unknown
  error?: {
    code?: string
    message?: string
  } | null
}

let pendingRefresh: Promise<OAuthCallbackSession> | null = null

function parseRefreshSession(payload: unknown): OAuthCallbackSession | null {
  if (typeof payload !== 'object' || payload === null) {
    return null
  }

  const accessToken = Reflect.get(payload, 'accessToken')
  const userId = Reflect.get(payload, 'userId')
  const newUser = Reflect.get(payload, 'newUser')

  if (
    typeof accessToken !== 'string' ||
    !accessToken ||
    typeof userId !== 'number' ||
    typeof newUser !== 'boolean'
  ) {
    return null
  }

  return { accessToken, userId, newUser }
}

async function requestAuthRefresh(options: RefreshAuthOptions) {
  const apiBaseUrl = options.apiBaseUrl.replace(/\/+$/, '')
  const response = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  })
  const payload = (await response.json().catch(() => null)) as RefreshResponse | null
  const session = payload?.success ? parseRefreshSession(payload.data) : null

  if (!response.ok || !session) {
    throw new Error(payload?.error?.code || `AUTH_REFRESH_FAILED_${response.status}`)
  }

  setAuthSession(session, { domain: options.domain })
  return session
}

export function refreshAuthSession(options: RefreshAuthOptions) {
  if (!pendingRefresh) {
    pendingRefresh = requestAuthRefresh(options).finally(() => {
      pendingRefresh = null
    })
  }

  return pendingRefresh
}
