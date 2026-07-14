import type { EventCategoryCode, EventItem } from '@/features/events/model/events'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')

interface EventsResponse {
  success: boolean
  data: EventItem[]
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

export async function getEvents(category: EventCategoryCode | null, signal?: AbortSignal) {
  const url = new URL(`${apiBaseUrl}/api/events`)

  if (category) {
    url.searchParams.set('category', category)
  }

  const response = await fetch(url, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
    signal,
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload) ?? `행사 목록을 불러오지 못했어요. (${response.status})`,
    )
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    Reflect.get(payload, 'success') !== true ||
    !Array.isArray(Reflect.get(payload, 'data'))
  ) {
    throw new Error(getErrorMessage(payload) ?? '행사 목록 응답이 올바르지 않아요.')
  }

  return (payload as EventsResponse).data
}
