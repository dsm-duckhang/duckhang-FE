import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getAdminAuthErrorMessage, requestAdminAuth } from '@/features/auth/api/adminAuth'

const adminAppUrl = import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:3002'

interface AdminAuthPageProps {
  mode: 'login' | 'signup'
}

const authContent = {
  login: {
    title: '관리자 로그인',
    description: '관리자 계정의 아이디와 비밀번호를 입력해 주세요.',
    pendingMessage: '로그인 중…',
    submitLabel: '관리자 로그인',
    successMessage: '관리자 로그인이 완료됐어요.',
    errorMessage: '관리자 로그인에 실패했어요.',
  },
  signup: {
    title: '관리자 계정 만들기',
    description: '관리자 계정으로 사용할 아이디와 비밀번호를 입력해 주세요.',
    pendingMessage: '계정 생성 중…',
    submitLabel: '관리자 계정 만들기',
    successMessage: '관리자 계정이 생성됐어요.',
    errorMessage: '관리자 계정을 만들지 못했어요.',
  },
} as const

function AdminAuthPage({ mode }: AdminAuthPageProps) {
  const content = authContent[mode]
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isSuccessToastVisible, setIsSuccessToastVisible] = useState(false)
  const authMutation = useMutation({
    mutationKey: ['admin-auth', mode],
    mutationFn: (credentials: { username: string; password: string }) =>
      requestAdminAuth(mode, credentials),
    onSuccess: () => {
      setIsSuccessToastVisible(true)
    },
  })

  useEffect(() => {
    if (!isSuccessToastVisible) return

    const timerId = window.setTimeout(() => {
      if (mode === 'login') {
        window.location.replace(adminAppUrl)
        return
      }

      setIsSuccessToastVisible(false)
    }, 1600)

    return () => window.clearTimeout(timerId)
  }, [isSuccessToastVisible, mode])

  const submitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSuccessToastVisible(false)
    authMutation.mutate({ username, password })
  }

  const errorMessage = authMutation.isError
    ? getAdminAuthErrorMessage(authMutation.error, content.errorMessage)
    : null

  return (
    <main className="mx-auto flex min-h-dvh min-h-screen w-full max-w-[430px] bg-white px-7 py-12 shadow-[0_0_32px_rgba(0,0,0,0.06)] sm:px-9 sm:py-16">
      <section aria-labelledby="admin-auth-title" className="flex w-full flex-1 flex-col">
        <header>
          <p className="text-sm font-bold tracking-[-0.02em] text-neutral-500">관리자 전용</p>
          <h1
            className="mt-2 text-[1.75rem] leading-tight font-black tracking-[-0.05em] text-neutral-950"
            id="admin-auth-title"
          >
            {content.title}
          </h1>
        </header>

        <div className="flex flex-1 flex-col justify-center py-8">
          <p className="text-sm leading-6 tracking-[-0.02em] text-neutral-600">
            {content.description}
          </p>

          <form className="mt-8 flex flex-col gap-6" onSubmit={submitAuth}>
            <div>
              <label className="block text-sm font-bold text-neutral-800" htmlFor="admin-username">
                아이디
              </label>
              <input
                autoComplete="username"
                className="mt-2 block h-14 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 text-base font-normal text-neutral-950 transition-[border-color,box-shadow,background-color] outline-none placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white focus:ring-3 focus:ring-neutral-950/10"
                id="admin-username"
                name="username"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="아이디를 입력해 주세요"
                required
                type="text"
                value={username}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-800" htmlFor="admin-password">
                비밀번호
              </label>
              <div className="relative mt-2">
                <input
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="block h-14 w-full rounded-xl border border-neutral-300 bg-neutral-50 py-0 pr-14 pl-4 text-base font-normal text-neutral-950 transition-[border-color,box-shadow,background-color] outline-none placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white focus:ring-3 focus:ring-neutral-950/10"
                  id="admin-password"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호를 입력해 주세요"
                  required
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-controls="admin-password"
                  aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                  aria-pressed={isPasswordVisible}
                  className="absolute inset-y-0 right-2 my-auto flex size-10 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-200/60 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-950"
                  onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
                  type="button"
                >
                  {isPasswordVisible ? (
                    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                      <path
                        d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.6 10.6 0 0 1 12 4c5.5 0 9 6 9 6a16 16 0 0 1-2.1 2.8M6.2 6.2C4.2 7.6 3 10 3 10s3.5 6 9 6c1.2 0 2.3-.3 3.3-.7"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              className="mt-1 h-14 w-full rounded-xl bg-neutral-950 px-5 text-base font-bold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 active:bg-black disabled:cursor-wait disabled:opacity-60"
              disabled={authMutation.isPending || isSuccessToastVisible}
              type="submit"
            >
              {authMutation.isPending ? content.pendingMessage : content.submitLabel}
            </button>
          </form>

          {mode === 'login' && (
            <p className="mt-6 text-center text-sm text-neutral-500">
              계정이 없다면?{' '}
              <Link
                className="font-bold text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
                to="/admin/signup"
              >
                회원가입
              </Link>
            </p>
          )}

          <div className={mode === 'login' ? 'mt-2 text-center' : 'mt-6 text-center'}>
            <Link
              className="inline-flex min-h-11 items-center px-4 text-sm font-semibold text-neutral-500 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
              to="/"
            >
              로그인 화면으로 돌아가기
            </Link>
          </div>
        </div>
      </section>

      {isSuccessToastVisible && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-6"
          role="status"
        >
          <div className="flex w-fit max-w-sm items-center gap-3 rounded-2xl bg-neutral-950 px-5 py-4 text-sm font-bold text-white shadow-[0_12px_36px_rgba(0,0,0,0.28)]">
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-neutral-950"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24">
                <path
                  d="m6 12.5 4 4 8-9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                />
              </svg>
            </span>
            {content.successMessage}
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminAuthPage
