import { getAdminAccessToken } from '@repo/auth'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')

function getErrorMessage(payload: unknown) {
  if (typeof payload !== 'object' || payload === null) {
    return null
  }

  const error = Reflect.get(payload, 'error')

  if (typeof error === 'object' && error !== null) {
    const message = Reflect.get(error, 'message')
    return typeof message === 'string' ? message : null
  }

  return null
}

export async function requestAdminLogout() {
  const accessToken = getAdminAccessToken()
  const response = await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({}),
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload) ?? `로그아웃 요청에 실패했어요. (${response.status})`)
  }

  if (typeof payload !== 'object' || payload === null || Reflect.get(payload, 'success') !== true) {
    throw new Error(getErrorMessage(payload) ?? '로그아웃 응답이 올바르지 않아요.')
  }
}
