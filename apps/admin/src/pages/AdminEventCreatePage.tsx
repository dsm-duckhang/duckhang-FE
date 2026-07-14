import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent, type EventCategoryCode } from '@/features/events/api/createEvent'

const categories = [
  { code: 'POPUP_STORE', label: '팝업스토어' },
  { code: 'CONCERT', label: '콘서트' },
  { code: 'CAFE', label: '카페' },
] as const satisfies ReadonlyArray<{ code: EventCategoryCode; label: string }>

const inputClassName =
  'min-h-16 w-full rounded-[1.25rem] border border-transparent bg-neutral-100 px-6 text-[0.95rem] text-neutral-950 outline-none transition focus:border-neutral-400 focus:bg-white placeholder:text-neutral-400'
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxImageSize = 10 * 1024 * 1024

function toIsoString(value: string) {
  return new Date(value).toISOString()
}

function AdminEventCreatePage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<EventCategoryCode>('POPUP_STORE')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const imagePreviewUrlRef = useRef('')

  useEffect(
    () => () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current)
      }
    },
    [],
  )

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setErrorMessage('')

    if (file && !allowedImageTypes.includes(file.type)) {
      event.target.value = ''
      setErrorMessage('JPG, PNG, WEBP 이미지만 등록할 수 있어요.')
      return
    }

    if (file && file.size > maxImageSize) {
      event.target.value = ''
      setErrorMessage('이미지는 10MB 이하만 등록할 수 있어요.')
      return
    }

    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current)
    }

    const nextPreviewUrl = file ? URL.createObjectURL(file) : ''
    imagePreviewUrlRef.current = nextPreviewUrl
    setImagePreviewUrl(nextPreviewUrl)
    setImageFile(file)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    if (!imageFile) {
      setErrorMessage('썸네일 이미지를 선택해 주세요.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const now = new Date().toISOString()
    const selectedCategory = categories.find((item) => item.code === category)
    setIsSubmitting(true)

    try {
      await createEvent(
        {
          title: String(formData.get('title') ?? '').trim(),
          category,
          categoryLabel: selectedCategory?.label ?? '',
          description: String(formData.get('description') ?? '').trim(),
          venueName: String(formData.get('venueName') ?? '').trim(),
          address: String(formData.get('address') ?? '').trim(),
          relatedLink: String(formData.get('relatedLink') ?? '').trim(),
          latitude: Number(formData.get('latitude')),
          longitude: Number(formData.get('longitude')),
          startAt: toIsoString(String(formData.get('startAt'))),
          endAt: toIsoString(String(formData.get('endAt'))),
          createdAt: now,
          updatedAt: now,
        },
        imageFile,
      )
      navigate('/events', { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '행사를 등록하지 못했어요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="event-create-title" className="px-7 pt-8 pb-10">
      <div className="flex items-center gap-3">
        <button
          aria-label="행사 목록으로 돌아가기"
          className="flex size-10 items-center justify-center rounded-full text-2xl text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          onClick={() => navigate('/events')}
          type="button"
        >
          ←
        </button>
        <h1
          className="text-xl font-black tracking-[-0.04em] text-neutral-950"
          id="event-create-title"
        >
          행사 추가
        </h1>
      </div>

      <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="mb-3 text-sm font-bold tracking-[-0.02em]">썸네일 이미지</legend>
          <label className="block cursor-pointer overflow-hidden rounded-[1.25rem] bg-neutral-100 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-neutral-950">
            {imagePreviewUrl ? (
              <img
                alt="행사 썸네일 미리보기"
                className="aspect-[2/1] w-full object-cover"
                src={imagePreviewUrl}
              />
            ) : (
              <div className="flex aspect-[2/1] flex-col items-center justify-center gap-2 text-neutral-400">
                <span aria-hidden="true" className="text-3xl">
                  ＋
                </span>
                <span className="text-sm">썸네일 이미지를 추가해 주세요</span>
              </div>
            )}
            <input
              accept="image/jpeg,image/png,image/webp"
              aria-label="썸네일 이미지 선택"
              className="sr-only"
              name="image"
              onChange={handleImageChange}
              required
              type="file"
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-3 px-1 text-xs text-neutral-500">
            <span className="truncate">{imageFile?.name ?? '선택된 파일 없음'}</span>
            <span className="shrink-0">JPG, PNG, WEBP · 최대 10MB</span>
          </div>
        </fieldset>

        <label className="block text-sm font-bold tracking-[-0.02em]">
          행사 이름을 적어주세요
          <input
            className={`${inputClassName} mt-3`}
            name="title"
            placeholder="행사 이름"
            required
          />
        </label>

        <fieldset>
          <legend className="mb-3 text-sm font-bold tracking-[-0.02em]">
            행사 종류를 알려주세요
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((item) => (
              <button
                aria-pressed={category === item.code}
                className={`min-h-10 rounded-full border px-5 text-sm font-bold transition-colors ${
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
          <legend className="mb-3 text-sm font-bold tracking-[-0.02em]">
            행사 일정, 위치를 입력해주세요
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-neutral-500">
              시작 일시
              <input
                className={`${inputClassName} mt-1 px-4`}
                name="startAt"
                required
                type="datetime-local"
              />
            </label>
            <label className="text-xs text-neutral-500">
              종료 일시
              <input
                className={`${inputClassName} mt-1 px-4`}
                name="endAt"
                required
                type="datetime-local"
              />
            </label>
          </div>
          <input
            className={`${inputClassName} mt-2`}
            name="venueName"
            placeholder="장소명 (예: 올림픽공원)"
            required
          />
          <input className={`${inputClassName} mt-2`} name="address" placeholder="주소" required />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              className={`${inputClassName} px-4`}
              name="latitude"
              placeholder="위도"
              required
              step="any"
              type="number"
            />
            <input
              className={`${inputClassName} px-4`}
              name="longitude"
              placeholder="경도"
              required
              step="any"
              type="number"
            />
          </div>
        </fieldset>

        <label className="block text-sm font-bold tracking-[-0.02em]">
          관련 링크를 입력해주세요
          <input
            className={`${inputClassName} mt-3`}
            name="relatedLink"
            placeholder="https://www.example.com"
            required
            type="url"
          />
        </label>

        <label className="block text-sm font-bold tracking-[-0.02em]">
          행사 세부사항을 입력해주세요
          <textarea
            className="mt-3 min-h-40 w-full resize-y rounded-[1.25rem] border border-transparent bg-neutral-100 p-6 text-[0.95rem] text-neutral-950 transition outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
            name="description"
            placeholder="행사에 대한 설명을 입력해 주세요"
            required
          />
        </label>

        {errorMessage && (
          <p aria-live="polite" className="text-sm font-medium text-red-600" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end pt-2">
          <button
            className="min-h-11 rounded-full bg-black px-7 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? '등록 중…' : '등록'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AdminEventCreatePage
