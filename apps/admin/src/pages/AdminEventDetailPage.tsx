import { useEffect, useState } from 'react'
import { AppIcon } from '@repo/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteEvent } from '@/features/events/api/deleteEvent'
import { getEvent } from '@/features/events/api/getEvent'
import {
  formatDate,
  getCategoryLabel,
  getEventStatusLabel,
  resolveEventImageUrl,
} from '@/features/events/lib/eventPresentation'
import type { EventItem } from '@/features/events/model/events'

function AdminEventDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const eventId = Number(id)
  const [event, setEvent] = useState<EventItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestKey, setRequestKey] = useState(0)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    getEvent(eventId, controller.signal)
      .then(setEvent)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setEvent(null)
        setErrorMessage(error instanceof Error ? error.message : '행사 정보를 불러오지 못했어요.')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [eventId, requestKey])

  function handleRetry() {
    setIsLoading(true)
    setErrorMessage('')
    setRequestKey((key) => key + 1)
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

        if (!didCopy) {
          throw new Error('URL 복사 실패')
        }
      }

      setShareStatus('copied')
    } catch {
      setShareStatus('error')
    }
  }

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/events')
  }

  async function handleDelete() {
    if (!event || !window.confirm(`“${event.title}” 행사를 삭제할까요?`)) {
      return
    }

    setIsDeleting(true)
    setDeleteErrorMessage('')

    try {
      await deleteEvent(event.id)
      navigate('/events', { replace: true })
    } catch (error) {
      setDeleteErrorMessage(error instanceof Error ? error.message : '행사를 삭제하지 못했어요.')
      setIsDeleting(false)
    }
  }

  return (
    <section aria-labelledby="event-detail-title" className="flex flex-1 flex-col px-5 pt-4 pb-6">
      <button
        aria-label="이전 화면으로 돌아가기"
        className="mb-4 flex size-10 items-center justify-center rounded-full text-2xl text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        onClick={handleBack}
        type="button"
      >
        ←
      </button>

      {isLoading && (
        <p aria-live="polite" className="py-24 text-center text-sm text-neutral-500" role="status">
          행사 정보를 불러오는 중이에요…
        </p>
      )}

      {!isLoading && errorMessage && (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
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
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                {getEventStatusLabel(event.startAt, event.endAt) && (
                  <span className="inline-flex min-h-7 items-center rounded-full bg-black px-3 font-bold text-white">
                    {getEventStatusLabel(event.startAt, event.endAt)}
                  </span>
                )}
                <span>{event.categoryLabel || getCategoryLabel(event.category)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="min-h-9 rounded-full border border-neutral-300 px-4 text-xs font-bold text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
                  onClick={() => navigate(`/events/${event.id}/edit`)}
                  type="button"
                >
                  수정
                </button>
                <button
                  className="min-h-9 rounded-full border border-red-200 px-4 text-xs font-bold text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:text-red-300"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  type="button"
                >
                  {isDeleting ? '삭제 중…' : '삭제'}
                </button>
              </div>
            </div>
            {deleteErrorMessage && (
              <p aria-live="polite" className="mt-3 text-right text-xs text-red-600" role="alert">
                {deleteErrorMessage}
              </p>
            )}
            <h1
              className="mt-3 text-2xl leading-tight font-black tracking-[-0.045em] text-neutral-950"
              id="event-detail-title"
            >
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

            <section className="py-7" aria-labelledby="event-description-title">
              <h2 className="sr-only" id="event-description-title">
                행사 안내
              </h2>
              <p className="text-sm leading-7 whitespace-pre-wrap text-neutral-600">
                {event.description}
              </p>
            </section>

            <div className="mt-auto pt-12">
              <p aria-live="polite" className="mb-3 min-h-5 text-center text-xs text-indigo-600">
                {shareStatus === 'copied' && '현재 페이지 주소를 복사했어요!'}
                {shareStatus === 'error' && '주소를 복사하지 못했어요. 다시 시도해 주세요.'}
                {shareStatus === 'idle' && '업데이트되는 행사 소식을 받아보세요!'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="min-h-13 rounded-xl bg-neutral-100 px-4 text-sm font-bold text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
                  onClick={handleShare}
                  type="button"
                >
                  {shareStatus === 'copied' ? '복사 완료' : '공유하기'}
                </button>
                {event.relatedLink && (
                  <a
                    className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#5b45ff] px-4 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b45ff]"
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

export default AdminEventDetailPage
