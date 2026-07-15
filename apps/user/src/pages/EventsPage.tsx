import { useEffect, useMemo, useState } from 'react'
import EventCard from '@/features/events/EventCard'
import { getEvents } from '@/features/events/api/getEvents'
import { sortEventsByStartAt } from '@/features/events/lib/eventPresentation'
import { eventCategories, eventStartSortOptions } from '@/features/events/model/events'
import type {
  EventCategoryCode,
  EventItem,
  EventStartSortOrder,
} from '@/features/events/model/events'

function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryCode | null>(null)
  const [sortOrder, setSortOrder] = useState<EventStartSortOrder>('ASC')
  const [events, setEvents] = useState<EventItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestKey, setRequestKey] = useState(0)
  const sortedEvents = useMemo(() => sortEventsByStartAt(events, sortOrder), [events, sortOrder])

  useEffect(() => {
    const controller = new AbortController()

    getEvents(selectedCategory, controller.signal)
      .then(setEvents)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setEvents([])
        setErrorMessage(error instanceof Error ? error.message : '행사 목록을 불러오지 못했어요.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [requestKey, selectedCategory])

  function handleCategorySelect(category: EventCategoryCode | null) {
    if (category === selectedCategory) return
    setIsLoading(true)
    setErrorMessage('')
    setSelectedCategory(category)
  }

  function handleRetry() {
    setIsLoading(true)
    setErrorMessage('')
    setRequestKey((key) => key + 1)
  }

  return (
    <section aria-labelledby="events-title" className="px-5 pt-12 pb-10">
      <h1 id="events-title" className="text-2xl leading-tight font-black tracking-[-0.045em]">
        행사
      </h1>
      <p className="mt-1 text-[0.95rem] tracking-[-0.025em] text-stone-400">
        진행중이거나 다가오는 덕질 여정이에요
      </p>

      <div aria-label="행사 카테고리" className="mt-8 flex gap-2 overflow-x-auto" role="group">
        {eventCategories.map((category) => {
          const isSelected = selectedCategory === category.value
          return (
            <button
              aria-pressed={isSelected}
              className={`min-h-10 rounded-full border px-3.5 text-sm font-bold ${
                isSelected
                  ? 'border-transparent bg-black text-white'
                  : 'border-neutral-300 bg-white text-neutral-900'
              }`}
              key={category.label}
              onClick={() => handleCategorySelect(category.value)}
              type="button"
            >
              {category.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <label className="sr-only" htmlFor="event-start-sort">
          행사 시작일 정렬
        </label>
        <select
          className="min-h-10 rounded-full border border-neutral-300 bg-white px-4 text-sm font-bold text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          id="event-start-sort"
          onChange={(event) => setSortOrder(event.target.value as EventStartSortOrder)}
          value={sortOrder}
        >
          {eventStartSortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {!isLoading && !errorMessage && (
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7">
          {sortedEvents.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      )}

      {isLoading && <p className="py-20 text-center text-sm text-neutral-500">불러오는 중…</p>}
      {!isLoading && errorMessage && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
          <button
            className="min-h-10 rounded-full border px-5 text-sm font-bold"
            onClick={handleRetry}
            type="button"
          >
            다시 시도
          </button>
        </div>
      )}
      {!isLoading && !errorMessage && events.length === 0 && (
        <p className="py-20 text-center text-sm text-neutral-500">해당 카테고리의 행사가 없어요.</p>
      )}
    </section>
  )
}

export default EventsPage
