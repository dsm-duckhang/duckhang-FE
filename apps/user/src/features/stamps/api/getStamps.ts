import { getAccessToken } from '@repo/auth'
import type { StampItem } from '@/features/stamps/model/stamps'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')

function getErrorMessage(payload: unknown) {
  if (typeof payload !== 'object' || payload === null) return null
  const error = Reflect.get(payload, 'error')
  if (typeof error !== 'object' || error === null) return null
  const message = Reflect.get(error, 'message')
  return typeof message === 'string' ? message : null
}

export async function getStamps(signal?: AbortSignal) {
  const accessToken = getAccessToken()
  const response = await fetch(`${apiBaseUrl}/api/stamps`, {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'ngrok-skip-browser-warning': 'true',
    },
    signal,
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload) ?? `스탬프를 불러오지 못했어요. (${response.status})`)
  }

  const data = typeof payload === 'object' && payload !== null ? Reflect.get(payload, 'data') : null
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Reflect.get(payload, 'success') !== true ||
    !Array.isArray(data)
  ) {
    throw new Error(getErrorMessage(payload) ?? '스탬프 목록 응답이 올바르지 않아요.')
  }

  return data as StampItem[]
}
