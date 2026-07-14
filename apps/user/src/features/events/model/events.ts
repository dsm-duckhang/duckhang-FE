const eventCategories = ['전체', '팝업스토어', '콘서트', '카페'] as const

type EventCategory = (typeof eventCategories)[number]
type FilterableEventCategory = Exclude<EventCategory, '전체'>

interface EventItem {
  id: number
  category: FilterableEventCategory
  title: string
  location: string
  period: string
  posterColor: string
}

const events: EventItem[] = [
  {
    id: 1,
    category: '팝업스토어',
    title: '더쿨디스트모먼트 팝업',
    location: '성수',
    period: '26. 07. 16 - 26. 07. 19',
    posterColor: '#E8DED1',
  },
  {
    id: 2,
    category: '콘서트',
    title: '수키도키 팝업 - 자존감 운동회',
    location: '성수',
    period: '26. 07. 10 - 26. 09. 07',
    posterColor: '#DCE8DF',
  },
  {
    id: 3,
    category: '카페',
    title: '박뚜기 소금빵 × 요정',
    location: '연남',
    period: '26. 07. 07 - 26. 07. 21',
    posterColor: '#E9E0CD',
  },
  {
    id: 4,
    category: '팝업스토어',
    title: '투쿨 with 에스더버니',
    location: '성수',
    period: '26. 07. 18 - 26. 08. 02',
    posterColor: '#D9E5EE',
  },
]

export { eventCategories, events }
export type { EventCategory, EventItem }
