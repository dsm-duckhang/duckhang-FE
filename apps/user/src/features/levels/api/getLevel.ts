import { getAccessToken } from '@repo/auth'
import type { LevelSummary } from '@/features/levels/model/level'

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

function parseLevel(data: unknown): LevelSummary | null {
  if (typeof data !== 'object' || data === null) return null

  const level = Reflect.get(data, 'level')
  const name = Reflect.get(data, 'name')
  const stampCount = Reflect.get(data, 'stampCount')
  const currentLevelMinStamps = Reflect.get(data, 'currentLevelMinStamps')
  const nextLevelMinStamps = Reflect.get(data, 'nextLevelMinStamps')
  const stampsToNextLevel = Reflect.get(data, 'stampsToNextLevel')

  if (
    typeof level !== 'number' ||
    typeof name !== 'string' ||
    typeof stampCount !== 'number' ||
    typeof currentLevelMinStamps !== 'number' ||
    (typeof nextLevelMinStamps !== 'number' && nextLevelMinStamps !== null) ||
    (typeof stampsToNextLevel !== 'number' && stampsToNextLevel !== null)
  ) {
    return null
  }

  return {
    level,
    name,
    stampCount,
    currentLevelMinStamps,
    nextLevelMinStamps,
    stampsToNextLevel,
  }
}

export async function getLevel(signal?: AbortSignal) {
  const accessToken = getAccessToken()
  const response = await fetch(`${apiBaseUrl}/api/levels`, {
    cache: 'no-store',
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'ngrok-skip-browser-warning': 'true',
    },
    signal,
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload) ?? `레벨을 불러오지 못했어요. (${response.status})`)
  }

  const data = typeof payload === 'object' && payload !== null ? Reflect.get(payload, 'data') : null
  const level = parseLevel(data)
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Reflect.get(payload, 'success') !== true ||
    !level
  ) {
    throw new Error(getErrorMessage(payload) ?? '레벨 응답이 올바르지 않아요.')
  }

  return level
}
