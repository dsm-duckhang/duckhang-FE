import { AppIcon } from '@repo/ui'
import type { EventItem } from '@/features/events/model/events'

interface EventCardProps {
  event: EventItem
}

function EventCard({ event }: EventCardProps) {
  return (
    <article className="min-w-0">
      <div
        aria-hidden="true"
        className="aspect-4/5 w-full rounded-[0.55rem]"
        style={{ backgroundColor: event.posterColor }}
      />
      <h2 className="mt-2.5 truncate text-[0.98rem] leading-6 font-bold tracking-[-0.025em] text-slate-700">
        {event.title}
      </h2>
      <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-600">
        <span className="text-slate-500">
          <AppIcon name="location" size={17} />
        </span>
        {event.location}
      </p>
      <p className="mt-0.5 text-sm tracking-[-0.02em] text-slate-600">{event.period}</p>
    </article>
  )
}

export default EventCard
