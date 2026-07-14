import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EventCard from '@/features/events/EventCard'
import { getEvents } from '@/features/events/api/getEvents'
import { eventCategories } from '@/features/events/model/events'
import type { EventCategoryCode, EventItem } from '@/features/events/model/events'

function AdminEventsPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryCode | null>(null)
  const [events, setEvents] = useState<EventItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestKey, setRequestKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getEvents(selectedCategory, controller.signal)
      .then(setEvents)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setEvents([])
        setErrorMessage(error instanceof Error ? error.message : '행사 목록을 불러오지 못했어요.')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [requestKey, selectedCategory])

  function handleCategorySelect(category: EventCategoryCode | null) {
    if (category === selectedCategory) {
      return
    }

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
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1
            id="events-title"
            className="text-2xl leading-tight font-black tracking-[-0.045em] text-neutral-950"
          >
            행사
          </h1>
          <p className="mt-1 text-[0.95rem] tracking-[-0.025em] text-stone-400">
            진행중이거나 다가오는 덕질 여정이에요
          </p>
        </div>
        <button
          className="h-11 shrink-0 rounded-full bg-black px-5 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          onClick={() => navigate('/events/new')}
          type="button"
        >
          행사 추가
        </button>
      </div>

      <div
        aria-label="행사 카테고리"
        className="mt-8 flex items-center gap-2 overflow-x-auto"
        role="group"
      >
        {eventCategories.map((category) => {
          const isSelected = selectedCategory === category.value

          return (
            <button
              aria-pressed={isSelected}
              className={`min-h-10 rounded-full border px-3.5 text-sm font-bold tracking-[-0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 ${
                isSelected
                  ? 'border-transparent bg-black text-white'
                  : 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50'
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

      {!isLoading && !errorMessage && (
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7">
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      )}

      {isLoading && (
        <p aria-live="polite" className="py-20 text-center text-sm text-neutral-500" role="status">
          행사 목록을 불러오는 중이에요…
        </p>
      )}

      {!isLoading && errorMessage && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
          <button
            className="min-h-10 rounded-full border border-neutral-300 px-5 text-sm font-bold"
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

export default AdminEventsPage
