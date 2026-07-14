import { useState } from 'react'
import EventCard from '@/features/events/EventCard'
import { eventCategories, events } from '@/features/events/model/events'
import type { EventCategory } from '@/features/events/model/events'

function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('전체')
  const filteredEvents =
    selectedCategory === '전체'
      ? events
      : events.filter((event) => event.category === selectedCategory)

  return (
    <section aria-labelledby="events-title" className="px-5 pt-12 pb-10">
      <h1
        id="events-title"
        className="text-2xl leading-tight font-black tracking-[-0.045em] text-neutral-950"
      >
        행사
      </h1>
      <p className="mt-1 text-[0.95rem] tracking-[-0.025em] text-stone-400">
        진행중이거나 다가오는 덕질 여정이에요
      </p>

      <div
        aria-label="행사 카테고리"
        className="mt-8 flex items-center gap-2 overflow-x-auto"
        role="group"
      >
        {eventCategories.map((category) => {
          const isSelected = selectedCategory === category

          return (
            <button
              aria-pressed={isSelected}
              className={`min-h-10 rounded-full border px-3.5 text-sm font-bold tracking-[-0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 ${
                isSelected
                  ? 'border-transparent bg-black text-white'
                  : 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50'
              }`}
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
            >
              {category}
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7">
        {filteredEvents.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p className="py-20 text-center text-sm text-neutral-500">해당 카테고리의 행사가 없어요.</p>
      )}
    </section>
  )
}

export default EventsPage
