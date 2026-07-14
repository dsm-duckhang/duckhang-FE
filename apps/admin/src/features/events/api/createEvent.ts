import { getAdminAccessToken } from '@repo/auth'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')

export type EventCategoryCode = 'POPUP_STORE' | 'CONCERT' | 'CAFE'

export interface CreateEventRequest {
  title: string
  category: EventCategoryCode
  categoryLabel: string
  description: string
  venueName: string
  address: string
  relatedLink: string
  latitude: number
  longitude: number
  startAt: string
  endAt: string
  createdAt: string
  updatedAt: string
}

interface CreateEventResponse {
  success: boolean
  data: {
    id: number
  } | null
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

  const message = Reflect.get(payload, 'message')
  return typeof message === 'string' ? message : null
}

export async function createEvent(body: CreateEventRequest, imageFile: File) {
  const accessToken = getAdminAccessToken()
  const formData = new FormData()

  formData.append('event', new Blob([JSON.stringify(body)], { type: 'application/json' }))
  formData.append('image', imageFile)

  const response = await fetch(`${apiBaseUrl}/api/events`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload) ?? `행사를 등록하지 못했어요. (${response.status})`)
  }

  if (typeof payload !== 'object' || payload === null || Reflect.get(payload, 'success') !== true) {
    throw new Error(getErrorMessage(payload) ?? '행사 등록 응답이 올바르지 않아요.')
  }

  return payload as CreateEventResponse
}
