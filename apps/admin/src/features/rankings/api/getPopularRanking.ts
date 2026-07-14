import type { PopularRanking } from '@/features/rankings/model/ranking'

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

function isPopularRanking(value: unknown): value is PopularRanking {
  if (typeof value !== 'object' || value === null) return false

  const period = Reflect.get(value, 'period')
  const artists = Reflect.get(value, 'artists')
  return (
    typeof period === 'string' &&
    Array.isArray(artists) &&
    artists.every(
      (artist) =>
        typeof artist === 'object' &&
        artist !== null &&
        Number.isInteger(Reflect.get(artist, 'rank')) &&
        typeof Reflect.get(artist, 'name') === 'string' &&
        typeof Reflect.get(artist, 'imageUrl') === 'string' &&
        typeof Reflect.get(artist, 'profileUrl') === 'string',
    )
  )
}

export async function getPopularRanking(signal?: AbortSignal): Promise<PopularRanking> {
  const response = await fetch(`${apiBaseUrl}/api/rankings/popular`, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
    signal,
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload) ?? `인기 랭킹을 불러오지 못했어요. (${response.status})`,
    )
  }

  const data = typeof payload === 'object' && payload !== null ? Reflect.get(payload, 'data') : null
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Reflect.get(payload, 'success') !== true ||
    !isPopularRanking(data)
  ) {
    throw new Error(getErrorMessage(payload) ?? '인기 랭킹 응답이 올바르지 않아요.')
  }

  return { ...data, artists: [...data.artists].sort((a, b) => a.rank - b.rank) }
}
