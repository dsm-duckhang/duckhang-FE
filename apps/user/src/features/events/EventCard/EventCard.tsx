import { AppIcon } from '@repo/ui'
import { Link } from 'react-router-dom'
import { formatDate, resolveEventImageUrl } from '@/features/events/lib/eventPresentation'
import type { EventItem } from '@/features/events/model/events'

interface EventCardProps {
  event: EventItem
}

function EventCard({ event }: EventCardProps) {
  return (
    <Link
      className="block min-w-0 rounded-[0.55rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"
      to={`/events/${event.id}`}
    >
      <div className="aspect-4/5 w-full overflow-hidden rounded-[0.55rem] bg-neutral-100">
        <img
          alt={`${event.title} 포스터`}
          className="size-full object-cover"
          onError={(error) => {
            error.currentTarget.hidden = true
          }}
          src={resolveEventImageUrl(event.imageUrl)}
        />
      </div>
      <h2 className="mt-2.5 truncate text-[0.98rem] leading-6 font-bold tracking-[-0.025em] text-slate-700">
        {event.title}
      </h2>
      <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-600">
        <span className="text-slate-500">
          <AppIcon name="location" size={17} />
        </span>
        {event.venueName}
      </p>
      <p className="mt-0.5 text-sm tracking-[-0.02em] text-slate-600">
        {formatDate(event.startAt)} - {formatDate(event.endAt)}
      </p>
    </Link>
  )
}

export default EventCard
