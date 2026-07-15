export type EventCategoryCode = 'POPUP_STORE' | 'CONCERT' | 'CAFE'
export type EventStartSortOrder = 'ASC' | 'DESC'

export interface EventItem {
  id: number
  title: string
  category: EventCategoryCode
  categoryLabel?: string
  description: string
  venueName: string
  address: string
  imageUrl: string
  relatedLink: string
  latitude: number
  longitude: number
  startAt: string
  endAt: string
  createdAt: string
  updatedAt: string
}

const eventCategories = [
  { label: '전체', value: null },
  { label: '팝업스토어', value: 'POPUP_STORE' },
  { label: '콘서트', value: 'CONCERT' },
  { label: '카페', value: 'CAFE' },
] as const satisfies ReadonlyArray<{ label: string; value: EventCategoryCode | null }>

const eventStartSortOptions = [
  { label: '시작일 빠른순', value: 'ASC' },
  { label: '시작일 느린순', value: 'DESC' },
] as const satisfies ReadonlyArray<{ label: string; value: EventStartSortOrder }>

export { eventCategories, eventStartSortOptions }
