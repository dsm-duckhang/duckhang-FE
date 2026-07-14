import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStamps } from '@/features/stamps/api/getStamps'
import type { StampItem } from '@/features/stamps/model/stamps'

function formatUnlockedAt(unlockedAt: string | null) {
  if (!unlockedAt) return null

  const date = new Date(unlockedAt)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('ko-KR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
        <rect height="10" rx="1.5" width="12" x="6" y="11" />
        <path d="M9 11V8a3 3 0 0 1 6 0v3M12 15v2" />
      </g>
    </svg>
  )
}

function StampPage() {
  const navigate = useNavigate()
  const [stamps, setStamps] = useState<StampItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestKey, setRequestKey] = useState(0)
  const unlockedCount = stamps.filter((stamp) => stamp.status === 'UNLOCKED').length

  useEffect(() => {
    const controller = new AbortController()
    getStamps(controller.signal)
      .then(setStamps)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStamps([])
        setErrorMessage(error instanceof Error ? error.message : '스탬프를 불러오지 못했어요.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [requestKey])

  function handleRetry() {
    setIsLoading(true)
    setErrorMessage('')
    setRequestKey((key) => key + 1)
  }

  return (
    <section aria-labelledby="stamp-title" className="px-5 pt-12 pb-12">
      <header>
        <h1
          className="text-2xl leading-tight font-black tracking-[-0.045em] text-neutral-950"
          id="stamp-title"
        >
          스탬프
        </h1>
        <p className="mt-1 text-[0.95rem] font-medium tracking-[-0.025em] text-stone-300">
          행사 현장을 인증하고 스탬프를 모아보세요
        </p>
      </header>

      {!isLoading && !errorMessage && (
        <section
          aria-label="내 스탬프 현황"
          className="mt-6 rounded-[1.6rem] bg-black px-5 py-5 text-white"
        >
          <p className="text-[0.65rem] font-medium text-neutral-300">획득한 스탬프</p>
          <p className="mt-1 text-[1.4rem] leading-tight font-black tracking-[-0.04em]">
            {unlockedCount} / {stamps.length}
          </p>
          <p className="mt-3 text-xs font-medium tracking-[-0.025em] text-neutral-300">
            {stamps.length - unlockedCount > 0
              ? `${stamps.length - unlockedCount}개의 스탬프가 남았어요`
              : '모든 스탬프를 획득했어요!'}
          </p>
        </section>
      )}

      {isLoading && (
        <p className="py-24 text-center text-sm text-neutral-500">스탬프를 불러오는 중이에요…</p>
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
      {!isLoading && !errorMessage && (
        <section aria-labelledby="my-stamps-title" className="mt-5">
          <h2
            className="text-sm font-bold tracking-[-0.035em] text-neutral-950"
            id="my-stamps-title"
          >
            내 스탬프 ({unlockedCount})
          </h2>
          {stamps.length === 0 ? (
            <p className="py-16 text-center text-sm text-neutral-500">
              아직 등록된 스탬프가 없어요.
            </p>
          ) : (
            <ul className="mt-3 grid grid-cols-4 gap-2.5">
              {stamps.map((stamp) => {
                const isUnlocked = stamp.status === 'UNLOCKED'
                const unlockedAt = formatUnlockedAt(stamp.unlockedAt)
                return (
                  <li
                    aria-label={`${isUnlocked ? '획득한' : '잠긴'} 스탬프: ${stamp.name}`}
                    className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.35rem] ${
                      isUnlocked
                        ? 'bg-black text-white'
                        : 'border border-neutral-400 bg-white text-neutral-950'
                    }`}
                    key={stamp.stampId}
                  >
                    {isUnlocked && stamp.imageUrl ? (
                      <img alt="" className="size-full object-cover" src={stamp.imageUrl} />
                    ) : (
                      <LockIcon />
                    )}
                    <span className="sr-only">
                      {stamp.name}
                      {isUnlocked && unlockedAt ? `, ${unlockedAt} 획득` : ''}
                    </span>
                    {isUnlocked && unlockedAt && (
                      <span className="absolute inset-x-1 bottom-1 truncate rounded bg-black/70 px-1 py-0.5 text-center text-[0.55rem] font-bold text-white">
                        {unlockedAt}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}

      <button
        className="mt-8 flex min-h-16 w-full cursor-pointer items-center gap-4 rounded-2xl px-6 text-left transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        onClick={() => navigate('/events')}
        type="button"
      >
        <span className="text-2xl" aria-hidden="true">
          ⌖
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold tracking-[-0.035em] text-neutral-950">
            근처 행사에서 스탬프 받기
          </span>
          <span className="mt-0.5 block text-xs font-semibold tracking-[-0.025em] text-stone-300">
            현재 위치를 인증하면 스탬프가 찍혀요
          </span>
        </span>
        <span aria-hidden="true" className="text-3xl font-light text-stone-400">
          ›
        </span>
      </button>
    </section>
  )
}

export default StampPage
