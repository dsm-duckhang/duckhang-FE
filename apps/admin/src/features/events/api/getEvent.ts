import type { EventItem } from '@/features/events/model/events'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')

interface EventResponse {
  success: boolean
  data: EventItem
  error: unknown
}

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

export async function getEvent(id: number, signal?: AbortSignal) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('올바르지 않은 행사 번호예요.')
  }

  const response = await fetch(`${apiBaseUrl}/api/events/${id}`, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
    signal,
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const fallbackMessage =
      response.status === 404
        ? '존재하지 않거나 삭제된 행사예요.'
        : `행사 정보를 불러오지 못했어요. (${response.status})`
    throw new Error(getErrorMessage(payload) ?? fallbackMessage)
  }

  const data = typeof payload === 'object' && payload !== null ? Reflect.get(payload, 'data') : null

  if (
    typeof payload !== 'object' ||
    payload === null ||
    Reflect.get(payload, 'success') !== true ||
    typeof data !== 'object' ||
    data === null
  ) {
    throw new Error(getErrorMessage(payload) ?? '행사 상세 응답이 올바르지 않아요.')
  }

  return (payload as EventResponse).data
}
