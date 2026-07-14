import { getAdminAccessToken } from '@repo/auth'
import type { EventCategoryCode, EventItem } from '@/features/events/model/events'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')

export interface UpdateEventRequest {
  title: string
  category: EventCategoryCode
  categoryLabel: string
  description: string
  venueName: string
  address: string
  imageUrl: string
  relatedLink: string
  latitude: number
  longitude: number
  startAt: string
  endAt: string
}

interface UpdateEventResponse {
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

export async function updateEvent(id: number, body: UpdateEventRequest, imageFile: File | null) {
  const accessToken = getAdminAccessToken()
  const formData = new FormData()

  formData.append('event', new Blob([JSON.stringify(body)], { type: 'application/json' }))

  if (imageFile) {
    formData.append('image', imageFile)
  }

  const response = await fetch(`${apiBaseUrl}/api/events/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const fallbackMessage =
      response.status === 404
        ? '존재하지 않거나 삭제된 행사예요.'
        : `행사를 수정하지 못했어요. (${response.status})`
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
    throw new Error(getErrorMessage(payload) ?? '행사 수정 응답이 올바르지 않아요.')
  }

  return (payload as UpdateEventResponse).data
}
