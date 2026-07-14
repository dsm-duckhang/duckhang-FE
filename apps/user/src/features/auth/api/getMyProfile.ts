import { getAccessToken } from '@repo/auth'
import type { MyProfile } from '@/features/auth/model/profile'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')

interface ApiErrorPayload {
  code?: string
  message?: string
}

export class MyProfileRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message)
    this.name = 'MyProfileRequestError'
  }
}

function getApiError(payload: unknown): ApiErrorPayload | null {
  if (typeof payload !== 'object' || payload === null) return null
  const error = Reflect.get(payload, 'error')
  if (typeof error !== 'object' || error === null) return null

  const code = Reflect.get(error, 'code')
  const message = Reflect.get(error, 'message')

  return {
    code: typeof code === 'string' ? code : undefined,
    message: typeof message === 'string' ? message : undefined,
  }
}

function parseMyProfile(data: unknown): MyProfile | null {
  if (typeof data !== 'object' || data === null) return null

  const level = Reflect.get(data, 'level')
  const id = Reflect.get(data, 'id')
  const email = Reflect.get(data, 'email')
  const nickname = Reflect.get(data, 'nickname')
  const profileImageUrl = Reflect.get(data, 'profileImageUrl')
  const role = Reflect.get(data, 'role')
  const levelData = typeof level === 'object' && level !== null ? level : null
  const levelNumber = levelData ? Reflect.get(levelData, 'level') : null
  const levelName = levelData ? Reflect.get(levelData, 'name') : null
  const stampCount = levelData ? Reflect.get(levelData, 'stampCount') : null
  const currentLevelMinStamps = levelData ? Reflect.get(levelData, 'currentLevelMinStamps') : null
  const nextLevelMinStamps = levelData ? Reflect.get(levelData, 'nextLevelMinStamps') : null
  const stampsToNextLevel = levelData ? Reflect.get(levelData, 'stampsToNextLevel') : null

  return {
    id: typeof id === 'number' ? id : 0,
    email: typeof email === 'string' ? email : '',
    nickname: typeof nickname === 'string' && nickname ? nickname : '사용자',
    profileImageUrl: typeof profileImageUrl === 'string' ? profileImageUrl : null,
    role: typeof role === 'string' ? role : 'USER',
    level: levelData
      ? {
          level: typeof levelNumber === 'number' ? levelNumber : 1,
          name: typeof levelName === 'string' ? levelName : '',
          stampCount: typeof stampCount === 'number' ? stampCount : 0,
          currentLevelMinStamps:
            typeof currentLevelMinStamps === 'number' ? currentLevelMinStamps : 0,
          nextLevelMinStamps: typeof nextLevelMinStamps === 'number' ? nextLevelMinStamps : null,
          stampsToNextLevel: typeof stampsToNextLevel === 'number' ? stampsToNextLevel : null,
        }
      : null,
  }
}

export async function getMyProfile(signal?: AbortSignal) {
  const accessToken = getAccessToken()
  const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
    cache: 'no-store',
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'ngrok-skip-browser-warning': 'true',
    },
    signal,
  })
  const payload: unknown = await response.json().catch(() => null)
  const apiError = getApiError(payload)

  if (!response.ok) {
    throw new MyProfileRequestError(
      apiError?.message ?? `내 정보를 불러오지 못했어요. (${response.status})`,
      response.status,
      apiError?.code,
    )
  }

  const data = typeof payload === 'object' && payload !== null ? Reflect.get(payload, 'data') : null
  const profile = parseMyProfile(data)
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Reflect.get(payload, 'success') !== true ||
    !profile
  ) {
    throw new MyProfileRequestError(
      apiError?.message ?? '내 정보 응답이 올바르지 않아요.',
      response.status,
      apiError?.code,
    )
  }

  return profile
}
