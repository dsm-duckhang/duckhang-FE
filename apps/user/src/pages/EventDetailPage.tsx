import { useEffect, useRef, useState } from 'react'
import { createVisit } from '@/features/visits/api/createVisit'
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

const maxVisitImageSize = 6 * 1024 * 1024

function EventDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const eventId = Number(id)
  const [event, setEvent] = useState<EventItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestKey, setRequestKey] = useState(0)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [visitStatus, setVisitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [visitMessage, setVisitMessage] = useState('')
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)
  const [visitImage, setVisitImage] = useState<File | null>(null)
  const [visitImagePreviewUrl, setVisitImagePreviewUrl] = useState<string | null>(null)
  const [visitLocation, setVisitLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'granted' | 'error'>(
    'idle',
  )
  const [locationMessage, setLocationMessage] = useState('')
  const visitImageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (visitImagePreviewUrl) URL.revokeObjectURL(visitImagePreviewUrl)
    }
  }, [visitImagePreviewUrl])

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

  async function handleVisitVerification() {
    setVisitImage(null)
    setVisitImagePreviewUrl(null)
    setVisitLocation(null)
    setLocationStatus('idle')
    setLocationMessage('')
    setVisitMessage('')
    setVisitStatus('idle')
    setIsVisitModalOpen(true)
  }

  function handleLocationPermission() {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      setLocationMessage('현재 위치를 확인할 수 없는 환경이에요.')
      return
    }

    setLocationStatus('loading')
    setLocationMessage('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setVisitLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationStatus('granted')
        setLocationMessage('현재 위치 사용이 허용됐어요.')
      },
      () => {
        setVisitLocation(null)
        setLocationStatus('error')
        setLocationMessage('브라우저의 위치 권한을 허용해 주세요.')
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15_000,
      },
    )
  }

  async function verifyVisit(imageFile: File) {
    if (!event || !visitLocation) {
      setVisitStatus('error')
      setVisitMessage('위치 권한을 먼저 허용해 주세요.')
      return
    }

    setVisitStatus('loading')
    setVisitMessage('현재 위치를 확인하는 중이에요…')

    try {
      const visit = await createVisit(
        {
          eventId: event.id,
          latitude: visitLocation.latitude,
          longitude: visitLocation.longitude,
          mockLocation: false,
          photoUrl: null,
        },
        imageFile,
      )
      setVisitStatus('success')
      setVisitMessage(`${visit.eventTitle} 스탬프를 획득했어요!`)
      setIsVisitModalOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : '방문 인증에 실패했어요.'
      setVisitStatus('error')
      setVisitMessage(message)
    }
  }

  function handleVisitImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const image = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''

    if (!image) return
    if (!image.type.startsWith('image/')) {
      setVisitImage(null)
      setVisitImagePreviewUrl(null)
      setVisitStatus('error')
      setVisitMessage('이미지 파일만 선택할 수 있어요.')
      return
    }
    if (image.size > maxVisitImageSize) {
      setVisitImage(null)
      setVisitImagePreviewUrl(null)
      setVisitStatus('error')
      setVisitMessage('이미지는 6MB 이하만 선택할 수 있어요.')
      return
    }

    setVisitImage(image)
    setVisitImagePreviewUrl(URL.createObjectURL(image))
    setVisitStatus('idle')
    setVisitMessage('')
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
              {shareStatus !== 'idle' && (
                <p aria-live="polite" className="mb-3 text-center text-xs text-indigo-600">
                  {shareStatus === 'copied'
                    ? '현재 페이지 주소를 복사했어요!'
                    : '주소를 복사하지 못했어요.'}
                </p>
              )}
              {visitStatus !== 'idle' && (
                <p
                  aria-live="polite"
                  className={`mb-3 text-center text-xs ${visitStatus === 'error' ? 'text-red-600' : 'text-indigo-600'}`}
                  role={visitStatus === 'error' ? 'alert' : undefined}
                >
                  {visitMessage}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="min-h-13 rounded-xl bg-neutral-100 text-sm font-bold"
                  onClick={handleShare}
                  type="button"
                >
                  {shareStatus === 'copied' ? '복사 완료' : '공유하기'}
                </button>
                <button
                  className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#5b45ff] text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-indigo-300"
                  disabled={visitStatus === 'loading' || visitStatus === 'success'}
                  onClick={handleVisitVerification}
                  type="button"
                >
                  <AppIcon name="location" size={19} />
                  {visitStatus === 'loading'
                    ? '인증 중…'
                    : visitStatus === 'success'
                      ? '인증 완료'
                      : '방문 인증'}
                </button>
              </div>
              {event.relatedLink && (
                <a
                  className="mt-3 flex min-h-11 items-center justify-center text-xs font-bold text-neutral-500 underline underline-offset-4"
                  href={event.relatedLink}
                  rel="noreferrer"
                  target="_blank"
                >
                  행사 관련 링크 열기
                </a>
              )}
            </div>
          </div>
        </article>
      )}
      {isVisitModalOpen && (
        <div
          aria-labelledby="visit-verification-title"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-end bg-black/45 sm:items-center sm:justify-center"
          role="dialog"
        >
          <section className="w-full rounded-t-[1.8rem] bg-white px-5 pt-6 pb-8 sm:max-w-sm sm:rounded-[1.8rem]">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-neutral-200" />
            <h2
              className="mt-5 text-xl font-black tracking-[-0.04em]"
              id="visit-verification-title"
            >
              방문 인증
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              현장에서 촬영한 사진과 현재 위치를 확인해 스탬프를 발급해요.
            </p>

            <button
              className={`mt-5 flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-bold disabled:cursor-wait ${
                locationStatus === 'granted'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-neutral-100 text-neutral-800'
              }`}
              disabled={locationStatus === 'loading'}
              onClick={handleLocationPermission}
              type="button"
            >
              {locationStatus === 'loading'
                ? '위치 확인 중…'
                : locationStatus === 'granted'
                  ? '위치 권한 허용 완료'
                  : '위치 권한 허용'}
            </button>
            {locationMessage && (
              <p
                className={`mt-2 text-center text-xs ${locationStatus === 'error' ? 'text-red-600' : 'text-emerald-700'}`}
                role={locationStatus === 'error' ? 'alert' : undefined}
              >
                {locationMessage}
              </p>
            )}

            <input
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={handleVisitImageChange}
              ref={visitImageInputRef}
              type="file"
            />
            <button
              className="mt-6 flex min-h-32 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center"
              onClick={() => visitImageInputRef.current?.click()}
              type="button"
            >
              {visitImagePreviewUrl ? (
                <img
                  alt="선택한 방문 인증 사진 미리보기"
                  className="h-44 w-full object-cover"
                  src={visitImagePreviewUrl}
                />
              ) : (
                <>
                  <svg
                    aria-hidden="true"
                    className="size-8 text-neutral-700"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      width="18"
                      x="3"
                      y="4"
                    />
                    <circle cx="8.5" cy="9" fill="currentColor" r="1.5" />
                    <path
                      d="m4 18 5.5-5 3.5 3 2.5-2 4.5 4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                  <span className="text-sm font-bold text-neutral-800">사진 선택</span>
                  <span className="max-w-full truncate text-xs text-neutral-400">
                    행사 현장이 잘 보이게 촬영해 주세요
                  </span>
                </>
              )}
            </button>
            {visitImage && (
              <p className="mt-2 truncate text-center text-xs text-neutral-400">
                {visitImage.name}
              </p>
            )}

            {visitStatus === 'error' && (
              <p className="mt-3 text-center text-xs text-red-600" role="alert">
                {visitMessage}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                className="min-h-12 rounded-xl bg-neutral-100 text-sm font-bold text-neutral-700"
                onClick={() => setIsVisitModalOpen(false)}
                type="button"
              >
                취소
              </button>
              <button
                className="min-h-12 rounded-xl bg-[#5b45ff] text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-indigo-300"
                disabled={!visitImage || !visitLocation}
                onClick={() => visitImage && void verifyVisit(visitImage)}
                type="button"
              >
                인증하기
              </button>
            </div>
          </section>
        </div>
      )}
      {visitStatus === 'loading' && (
        <div
          aria-label="방문 인증 처리 중"
          aria-live="assertive"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45"
          role="status"
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-7 py-6 shadow-xl">
            <svg
              aria-hidden="true"
              className="size-9 animate-spin text-[#5b45ff]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="3"
              />
              <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
            <p className="text-sm font-bold text-neutral-900">방문 인증 중이에요…</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default EventDetailPage
