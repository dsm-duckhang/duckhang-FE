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

export async function deleteEvent(id: number) {
  const accessToken = getAdminAccessToken()
  const response = await fetch(`${apiBaseUrl}/api/events/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const fallbackMessage =
      response.status === 404
        ? '존재하지 않거나 이미 삭제된 행사예요.'
        : `행사를 삭제하지 못했어요. (${response.status})`
    throw new Error(getErrorMessage(payload) ?? fallbackMessage)
  }

  if (typeof payload !== 'object' || payload === null || Reflect.get(payload, 'success') !== true) {
    throw new Error(getErrorMessage(payload) ?? '행사 삭제 응답이 올바르지 않아요.')
  }
}
