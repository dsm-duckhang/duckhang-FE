import { useEffect, useState } from 'react'
import { AppIcon } from '@repo/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { getEvent } from '@/features/events/api/getEvent'
import {
  formatDate,
  getCategoryLabel,
  getEventStatusLabel,
  resolveEventImageUrl,
} from '@/features/events/lib/eventPresentation'
import type { EventItem } from '@/features/events/model/events'

function EventDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const eventId = Number(id)
  const [event, setEvent] = useState<EventItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestKey, setRequestKey] = useState(0)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    const controller = new AbortController()
    getEvent(eventId, controller.signal)
      .then(setEvent)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setEvent(null)
        setErrorMessage(error instanceof Error ? error.message : '행사를 불러오지 못했어요.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [eventId, requestKey])

  function handleRetry() {
    setIsLoading(true)
    setErrorMessage('')
    setRequestKey((key) => key + 1)
  }

  function handleBack() {
    if (window.history.length > 1) navigate(-1)
    else navigate('/events')
  }

  async function handleShare() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href)
      } else {
        const input = document.createElement('textarea')
        input.value = window.location.href
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.append(input)
        input.select()
        const didCopy = document.execCommand('copy')
        input.remove()

        if (!didCopy) throw new Error('URL 복사 실패')
      }

      setShareStatus('copied')
    } catch {
      setShareStatus('error')
    }
  }

  return (
    <section className="flex flex-1 flex-col px-5 pt-4 pb-6" aria-labelledby="event-detail-title">
      <button
        aria-label="이전 화면으로 돌아가기"
        className="mb-4 flex size-10 items-center justify-center rounded-full text-2xl"
        onClick={handleBack}
        type="button"
      >
        ←
      </button>

      {isLoading && (
        <p className="py-24 text-center text-sm text-neutral-500">행사 정보를 불러오는 중이에요…</p>
      )}
      {!isLoading && errorMessage && (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
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

      {!isLoading && !errorMessage && event && (
        <article className="flex flex-1 flex-col">
          <div className="-mx-5 flex aspect-square items-center justify-center overflow-hidden bg-neutral-100">
            <img
              alt={`${event.title} 포스터`}
              className="size-full object-contain"
              onError={(error) => {
                error.currentTarget.hidden = true
              }}
              src={resolveEventImageUrl(event.imageUrl)}
            />
          </div>
          <div className="flex flex-1 flex-col pt-7">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="inline-flex min-h-7 items-center rounded-full bg-black px-3 font-bold text-white">
                {getEventStatusLabel(event.startAt, event.endAt)}
              </span>
              <span>{event.categoryLabel || getCategoryLabel(event.category)}</span>
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-[-0.045em]" id="event-detail-title">
              {event.title}
            </h1>

            <dl className="mt-7 border-y border-neutral-100 text-xs">
              <div className="grid min-h-25 grid-cols-[4rem_1fr] gap-4 border-b border-neutral-100 py-5">
                <dt className="text-neutral-400">일정</dt>
                <dd className="text-right leading-6 text-neutral-700">
                  {formatDate(event.startAt)} - {formatDate(event.endAt)}
                </dd>
              </div>
              <div className="grid min-h-25 grid-cols-[4rem_1fr] gap-4 py-5">
                <dt className="text-neutral-400">위치</dt>
                <dd className="text-right leading-6 text-neutral-700">
                  <p>{event.venueName}</p>
                  <p>{event.address}</p>
                </dd>
              </div>
            </dl>
            <p className="py-7 text-sm leading-7 whitespace-pre-wrap text-neutral-600">
              {event.description}
            </p>

            <div className="mt-auto pt-12">
              <p aria-live="polite" className="mb-3 min-h-5 text-center text-xs text-indigo-600">
                {shareStatus === 'copied'
                  ? '현재 페이지 주소를 복사했어요!'
                  : shareStatus === 'error'
                    ? '주소를 복사하지 못했어요.'
                    : '업데이트되는 행사 소식을 받아보세요!'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="min-h-13 rounded-xl bg-neutral-100 text-sm font-bold"
                  onClick={handleShare}
                  type="button"
                >
                  {shareStatus === 'copied' ? '복사 완료' : '공유하기'}
                </button>
                {event.relatedLink && (
                  <a
                    className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#5b45ff] text-sm font-bold text-white"
                    href={event.relatedLink}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <AppIcon name="location" size={19} />
                    링크 이동하기
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>
      )}
    </section>
  )
}

export default EventDetailPage
