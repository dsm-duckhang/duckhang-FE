import { getAccessToken } from '@repo/auth'

export interface CreateVisitRequest {
  eventId: number
  latitude: number
  longitude: number
  mockLocation: false
  photoUrl: null
}

export interface VisitRecord {
  id: number
  eventId: number
  eventTitle: string
  venueName: string
  distanceMeters: number
  locationVerified: boolean
  cameraVerified: boolean
  photoUrl: string | null
  visitedAt: string
}

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')
const maxImageSize = 6 * 1024 * 1024

const errorMessages: Record<string, string> = {
  aiAdditionalCaptureRequired: '사진을 다시 촬영해 주세요.',
  aiVerificationRejected: '방문 인증에 실패했어요.',
  locationVerificationFailed: '행사장 허용 반경 안에서 인증해 주세요.',
  mockLocationDetected: '모의 위치가 감지되어 인증할 수 없어요.',
  visitAlreadyExists: '이미 이 행사에서 스탬프를 획득했어요.',
}

function getErrorMessage(payload: unknown) {
  if (typeof payload !== 'object' || payload === null) return null
  const error = Reflect.get(payload, 'error')
  if (typeof error !== 'object' || error === null) return null
  const code = Reflect.get(error, 'code')
  const message = Reflect.get(error, 'message')
  return (
    (typeof code === 'string' && errorMessages[code]) ||
    (typeof message === 'string' ? message : null)
  )
}

export async function createVisit(request: CreateVisitRequest, imageFile: File) {
  if (imageFile.size > maxImageSize) {
    throw new Error('이미지는 6MB 이하만 업로드할 수 있어요.')
  }

  const accessToken = getAccessToken()
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }))
  formData.append('image', imageFile)

  const response = await fetch(`${apiBaseUrl}/api/visits`, {
    body: formData,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'ngrok-skip-browser-warning': 'true',
    },
    method: 'POST',
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload) ?? `방문 인증에 실패했어요. (${response.status})`)
  }

  const data = typeof payload === 'object' && payload !== null ? Reflect.get(payload, 'data') : null
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Reflect.get(payload, 'success') !== true ||
    typeof data !== 'object' ||
    data === null
  ) {
    throw new Error(getErrorMessage(payload) ?? '방문 인증 응답이 올바르지 않아요.')
  }

  return data as VisitRecord
}
