import { useEffect, useState } from 'react'
import { setAuthSession } from '@repo/auth'

const userAppUrl = import.meta.env.VITE_USER_APP_URL || 'http://localhost:3001'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

const errorMessages: Record<string, string> = {
  ACCESS_DENIED: 'Google 로그인 동의가 취소됐어요.',
  INVALID_OAUTH_STATE: '로그인 요청이 만료됐어요. 처음부터 다시 시도해 주세요.',
  INVALID_GOOGLE_TOKEN: 'Google 인증 정보를 확인하지 못했어요. 다시 시도해 주세요.',
}

function normalizeErrorCode(errorCode: string) {
  return errorCode
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/-/g, '_')
    .toUpperCase()
}

type CallbackResult =
  | { status: 'success'; accessToken: string; newUser: boolean }
  | { status: 'error'; message: string; errorCode?: string }

function readCallbackResult(): CallbackResult {
  const query = new URLSearchParams(window.location.search)
  const errorCode = query.get('error')

  if (errorCode) {
    const normalizedErrorCode = normalizeErrorCode(errorCode)

    return {
      status: 'error',
      message:
        errorMessages[normalizedErrorCode] ?? 'Google 로그인에 실패했어요. 다시 시도해 주세요.',
      errorCode,
    }
  }

  const fragment = new URLSearchParams(window.location.hash.slice(1))
  const accessToken = fragment.get('accessToken')
  const newUserValue = fragment.get('newUser')

  if (!accessToken || (newUserValue !== 'true' && newUserValue !== 'false')) {
    return {
      status: 'error',
      message: '로그인 결과가 올바르지 않아요. 처음부터 다시 시도해 주세요.',
    }
  }

  return {
    status: 'success',
    accessToken,
    newUser: newUserValue === 'true',
  }
}

function OAuthCallbackPage() {
  const [result] = useState(readCallbackResult)

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname)

    if (result.status === 'success') {
      setAuthSession(
        { accessToken: result.accessToken, newUser: result.newUser },
        { domain: cookieDomain },
      )
      window.location.replace(userAppUrl)
    }
  }, [result])

  if (result.status === 'error') {
    return (
      <main className="flex items-center justify-center bg-neutral-50 px-6">
        <section className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-neutral-950">로그인하지 못했어요</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600" role="alert">
            {result.message}
          </p>
          {result.errorCode && (
            <p className="mt-2 font-mono text-xs text-neutral-400">{result.errorCode}</p>
          )}
          <button
            className="mt-7 h-12 w-full rounded-2xl bg-neutral-950 px-5 text-sm font-bold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 active:bg-black"
            onClick={() => window.location.replace('/')}
            type="button"
          >
            로그인 화면으로 돌아가기
          </button>
        </section>
      </main>
    )
  }

  return (
    <main
      aria-live="polite"
      className="flex items-center justify-center px-6 text-center text-sm text-neutral-600"
      role="status"
    >
      로그인 완료 중…
    </main>
  )
}

export default OAuthCallbackPage
