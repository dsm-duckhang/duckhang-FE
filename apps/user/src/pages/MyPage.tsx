import { useEffect, useState } from 'react'
import { clearAuthSession } from '@repo/auth'
import duckImage from '@repo/ui/assets/duck'
import { getMyProfile, MyProfileRequestError } from '@/features/auth/api/getMyProfile'
import type { MyProfile } from '@/features/auth/model/profile'

const loginAppUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:3000'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

function MyPage() {
  const [profile, setProfile] = useState<MyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestKey, setRequestKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getMyProfile(controller.signal)
      .then(setProfile)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return

        if (error instanceof MyProfileRequestError && error.status === 401) {
          clearAuthSession({ domain: cookieDomain })
          window.location.replace(loginAppUrl)
          return
        }

        setProfile(null)
        setErrorMessage(error instanceof Error ? error.message : '내 정보를 불러오지 못했어요.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [requestKey])

  const handleLogout = () => {
    clearAuthSession({ domain: cookieDomain })
    window.location.replace(loginAppUrl)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setErrorMessage('')
    setRequestKey((key) => key + 1)
  }

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100dvh-9.5rem)] items-center justify-center px-5">
        <p className="text-sm text-neutral-500" role="status">
          내 정보를 불러오는 중이에요…
        </p>
      </section>
    )
  }

  if (errorMessage || !profile) {
    return (
      <section className="flex min-h-[calc(100dvh-9.5rem)] flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-sm text-red-600" role="alert">
          {errorMessage || '내 정보를 불러오지 못했어요.'}
        </p>
        <button
          className="min-h-10 rounded-full border px-5 text-sm font-bold"
          onClick={handleRetry}
          type="button"
        >
          다시 시도
        </button>
      </section>
    )
  }

  const levelStats = profile.level
    ? [
        { label: '보유 스탬프', value: profile.level.stampCount },
        {
          label: '다음 레벨까지',
          value: profile.level.stampsToNextLevel ?? '-',
        },
        { label: '현재 레벨 기준', value: profile.level.currentLevelMinStamps },
        { label: '다음 레벨 기준', value: profile.level.nextLevelMinStamps ?? '-' },
      ]
    : null
  const roleLabel = profile.role === 'USER' ? '일반 회원' : profile.role

  return (
    <section className="flex min-h-[calc(100dvh-9.5rem)] flex-col px-4 pt-5 pb-8">
      <div className="flex items-center gap-3 px-1">
        {profile.profileImageUrl ? (
          <img
            alt={`${profile.nickname}님 프로필`}
            className="size-14 shrink-0 rounded-full bg-[#f0eee8] object-cover"
            src={profile.profileImageUrl}
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#f0eee8] text-lg font-black text-neutral-500"
          >
            {profile.nickname.slice(0, 1)}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold tracking-[-0.03em] text-neutral-900">
            {profile.nickname} 님
          </h1>
          <p className="mt-0.5 truncate text-xs text-neutral-400">{profile.email}</p>
          {profile.level && (
            <span className="mt-1 inline-flex rounded-full bg-neutral-950 px-2 py-0.5 text-[0.625rem] font-semibold text-white">
              Lv.{profile.level.level} {profile.level.name}
            </span>
          )}
        </div>
      </div>

      {profile.level && levelStats && (
        <section aria-labelledby="level-summary-title" className="mt-6">
          <div className="flex items-end justify-between px-1">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[-0.02em] text-neutral-400">
                나의 여정 레벨
              </p>
              <h2
                className="mt-0.5 text-lg font-black tracking-[-0.04em] text-neutral-950"
                id="level-summary-title"
              >
                Lv.{profile.level.level} {profile.level.name}
              </h2>
            </div>
            {profile.level.stampsToNextLevel !== null && (
              <p className="pb-0.5 text-xs font-semibold text-neutral-500">
                다음 레벨까지 {profile.level.stampsToNextLevel}개
              </p>
            )}
          </div>

          <dl className="mt-3 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#d8d3cb] bg-white">
            {levelStats.map(({ label, value }, index) => (
              <div
                className={`flex min-h-20 flex-col items-center justify-center ${
                  index % 2 === 1 ? 'border-l border-[#e4e0da]' : ''
                } ${index > 1 ? 'border-t border-[#e4e0da]' : ''}`}
                key={label}
              >
                <dt className="order-2 mt-1.5 text-[0.65rem] leading-none font-medium text-neutral-500">
                  {label}
                </dt>
                <dd className="order-1 text-lg leading-none font-bold text-neutral-900 tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section aria-labelledby="account-info-title" className="mt-6">
        <h2
          className="px-1 text-sm font-bold tracking-[-0.035em] text-neutral-950"
          id="account-info-title"
        >
          계정 정보
        </h2>
        <dl className="mt-2 overflow-hidden rounded-2xl bg-neutral-50 px-4">
          <div className="flex min-h-12 items-center justify-between gap-4 border-b border-neutral-200">
            <dt className="shrink-0 text-xs font-medium text-neutral-500">이메일</dt>
            <dd className="truncate text-sm font-semibold text-neutral-900">{profile.email}</dd>
          </div>
          <div className="flex min-h-12 items-center justify-between gap-4">
            <dt className="shrink-0 text-xs font-medium text-neutral-500">회원 유형</dt>
            <dd className="truncate text-sm font-semibold text-neutral-900">{roleLabel}</dd>
          </div>
        </dl>
      </section>

      <button
        className="mt-2.5 ml-auto min-h-11 rounded-lg px-1 text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        onClick={handleLogout}
        type="button"
      >
        로그아웃
      </button>

      <div className="mt-auto flex justify-center pt-8 pb-2">
        <img
          alt=""
          aria-hidden="true"
          className="w-64 max-w-[70vw] object-contain"
          draggable={false}
          src={duckImage}
        />
      </div>
    </section>
  )
}

export default MyPage
