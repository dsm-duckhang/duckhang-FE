import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEvent } from '@/features/events/api/getEvent'
import { updateEvent } from '@/features/events/api/updateEvent'
import { resolveEventImageUrl } from '@/features/events/lib/eventPresentation'
import {
  getImageFileError,
  imageFileAccept,
  normalizeImageFile,
} from '@/features/events/lib/imageFile'
import type { EventCategoryCode, EventItem } from '@/features/events/model/events'

const categories = [
  { code: 'POPUP_STORE', label: '팝업스토어' },
  { code: 'CONCERT', label: '콘서트' },
  { code: 'CAFE', label: '카페' },
] as const satisfies ReadonlyArray<{ code: EventCategoryCode; label: string }>

const inputClassName =
  'min-h-14 w-full rounded-[1.1rem] border border-transparent bg-neutral-100 px-5 text-sm text-neutral-950 outline-none transition focus:border-neutral-400 focus:bg-white placeholder:text-neutral-400'
function toDateTimeLocal(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 16)
}

function AdminEventEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const eventId = Number(id)
  const [event, setEvent] = useState<EventItem | null>(null)
  const [category, setCategory] = useState<EventCategoryCode>('POPUP_STORE')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestKey, setRequestKey] = useState(0)
  const imagePreviewUrlRef = useRef('')

  useEffect(
    () => () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    const controller = new AbortController()

    getEvent(eventId, controller.signal)
      .then((eventData) => {
        setEvent(eventData)
        setCategory(eventData.category)
      })
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

  function handleImageChange(changeEvent: React.ChangeEvent<HTMLInputElement>) {
    const file = changeEvent.target.files?.[0] ?? null
    setErrorMessage('')

    if (file) {
      const fileError = getImageFileError(file)

      if (fileError) {
        changeEvent.target.value = ''
        setErrorMessage(fileError)
        return
      }
    }

    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current)
    }

    const normalizedFile = file ? normalizeImageFile(file) : null
    const nextPreviewUrl = normalizedFile ? URL.createObjectURL(normalizedFile) : ''
    imagePreviewUrlRef.current = nextPreviewUrl
    setImagePreviewUrl(nextPreviewUrl)
    setImageFile(normalizedFile)
  }

  async function handleSubmit(submitEvent: React.FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault()

    if (!event) {
      return
    }

    const formData = new FormData(submitEvent.currentTarget)
    const selectedCategory = categories.find((item) => item.code === category)
    const startAt = new Date(String(formData.get('startAt')))
    const endAt = new Date(String(formData.get('endAt')))

    if (endAt < startAt) {
      setErrorMessage('종료 일시는 시작 일시보다 빠를 수 없어요.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await updateEvent(
        eventId,
        {
          title: String(formData.get('title') ?? '').trim(),
          category,
          categoryLabel: selectedCategory?.label ?? '',
          description: String(formData.get('description') ?? '').trim(),
          venueName: String(formData.get('venueName') ?? '').trim(),
          address: String(formData.get('address') ?? '').trim(),
          imageUrl: event.imageUrl,
          relatedLink: String(formData.get('relatedLink') ?? '').trim(),
          latitude: Number(formData.get('latitude')),
          longitude: Number(formData.get('longitude')),
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
        },
        imageFile,
      )
      navigate(`/events/${eventId}`, { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '행사를 수정하지 못했어요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="event-edit-title" className="px-6 pt-7 pb-10">
      <div className="flex items-center gap-3">
        <button
          aria-label="행사 상세로 돌아가기"
          className="flex size-10 items-center justify-center rounded-full text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          onClick={() => navigate(`/events/${eventId}`)}
          type="button"
        >
          ←
        </button>
        <h1 className="text-xl font-black tracking-[-0.04em]" id="event-edit-title">
          행사 수정
        </h1>
      </div>

      {isLoading && (
        <p aria-live="polite" className="py-24 text-center text-sm text-neutral-500" role="status">
          행사 정보를 불러오는 중이에요…
        </p>
      )}

      {!isLoading && !event && errorMessage && (
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

      {!isLoading && event && (
        <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="mb-3 text-sm font-bold">썸네일 이미지</legend>
            <label className="block cursor-pointer overflow-hidden rounded-[1.1rem] bg-neutral-100 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-neutral-950">
              <div className="aspect-[2/1]">
                <img
                  alt={`${event.title} 썸네일 미리보기`}
                  className="size-full object-contain"
                  onError={(error) => {
                    error.currentTarget.hidden = true
                  }}
                  src={imagePreviewUrl || resolveEventImageUrl(event.imageUrl)}
                />
              </div>
              <input
                accept={imageFileAccept}
                aria-label="새 썸네일 이미지 선택"
                className="sr-only"
                name="image"
                onChange={handleImageChange}
                type="file"
              />
            </label>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-neutral-500">
              <span className="truncate">
                {imageFile?.name ?? '이미지를 선택하지 않으면 기존 이미지가 유지돼요.'}
              </span>
              <span className="shrink-0">최대 5MB</span>
            </div>
          </fieldset>

          <label className="block text-sm font-bold">
            행사 이름
            <input
              className={`${inputClassName} mt-3`}
              defaultValue={event.title}
              name="title"
              required
            />
          </label>

          <fieldset>
            <legend className="mb-3 text-sm font-bold">행사 종류</legend>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  aria-pressed={category === item.code}
                  className={`min-h-10 rounded-full border px-5 text-sm font-bold ${
                    category === item.code
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 bg-white text-neutral-700'
                  }`}
                  key={item.code}
                  onClick={() => setCategory(item.code)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-bold">행사 일정 및 위치</legend>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-neutral-500">
                시작 일시
                <input
                  className={`${inputClassName} mt-1 px-3`}
                  defaultValue={toDateTimeLocal(event.startAt)}
                  name="startAt"
                  required
                  type="datetime-local"
                />
              </label>
              <label className="text-xs text-neutral-500">
                종료 일시
                <input
                  className={`${inputClassName} mt-1 px-3`}
                  defaultValue={toDateTimeLocal(event.endAt)}
                  name="endAt"
                  required
                  type="datetime-local"
                />
              </label>
            </div>
            <input
              className={`${inputClassName} mt-2`}
              defaultValue={event.venueName}
              name="venueName"
              placeholder="장소명"
              required
            />
            <input
              className={`${inputClassName} mt-2`}
              defaultValue={event.address}
              name="address"
              placeholder="주소"
              required
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                className={`${inputClassName} px-3`}
                defaultValue={event.latitude}
                max="90"
                min="-90"
                name="latitude"
                placeholder="위도"
                required
                step="any"
                type="number"
              />
              <input
                className={`${inputClassName} px-3`}
                defaultValue={event.longitude}
                max="180"
                min="-180"
                name="longitude"
                placeholder="경도"
                required
                step="any"
                type="number"
              />
            </div>
          </fieldset>

          <label className="block text-sm font-bold">
            관련 링크
            <input
              className={`${inputClassName} mt-3`}
              defaultValue={event.relatedLink}
              name="relatedLink"
              required
              type="url"
            />
          </label>

          <label className="block text-sm font-bold">
            행사 세부사항
            <textarea
              className="mt-3 min-h-40 w-full resize-y rounded-[1.1rem] border border-transparent bg-neutral-100 p-5 text-sm outline-none focus:border-neutral-400 focus:bg-white"
              defaultValue={event.description}
              name="description"
              required
            />
          </label>

          {errorMessage && (
            <p aria-live="polite" className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="min-h-13 w-full rounded-full bg-black px-6 text-sm font-bold text-white disabled:bg-neutral-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? '수정 중…' : '수정 완료'}
          </button>
        </form>
      )}
    </section>
  )
}

export default AdminEventEditPage
