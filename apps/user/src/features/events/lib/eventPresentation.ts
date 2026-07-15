import type {
  EventCategoryCode,
  EventItem,
  EventStartSortOrder,
} from '@/features/events/model/events'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')

const categoryLabels: Record<EventCategoryCode, string> = {
  POPUP_STORE: '팝업스토어',
  CONCERT: '콘서트',
  CAFE: '카페',
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Seoul',
})

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date).replace(/\.$/, '')
}

function resolveEventImageUrl(imageUrl: string) {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl
  const imagePath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  return `${apiBaseUrl}${imagePath}`
}

function getCategoryLabel(category: EventCategoryCode) {
  return categoryLabels[category]
}

function getEventStatusLabel(startAt: string, endAt: string) {
  const now = new Date()
  const start = new Date(startAt)
  const end = new Date(endAt)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const days = Math.round((startDate.getTime() - today.getTime()) / 86_400_000)

  if (days > 0) return `D-${days}`
  if (days === 0) return 'D-DAY'
  return now <= end ? '진행중' : '종료'
}

function sortEventsByStartAt(events: EventItem[], order: EventStartSortOrder) {
  return [...events].sort((a, b) => {
    const aTime = new Date(a.startAt).getTime()
    const bTime = new Date(b.startAt).getTime()
    const aIsInvalid = Number.isNaN(aTime)
    const bIsInvalid = Number.isNaN(bTime)

    if (aIsInvalid && bIsInvalid) return 0
    if (aIsInvalid) return 1
    if (bIsInvalid) return -1
    return order === 'ASC' ? aTime - bTime : bTime - aTime
  })
}

export {
  formatDate,
  getCategoryLabel,
  getEventStatusLabel,
  resolveEventImageUrl,
  sortEventsByStartAt,
}
