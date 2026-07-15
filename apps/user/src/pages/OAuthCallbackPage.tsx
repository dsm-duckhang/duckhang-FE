import { useEffect, useState } from 'react'
import { setAuthSession } from '@repo/auth'

const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

type CallbackResult =
  { status: 'success'; accessToken: string; newUser: boolean } | { status: 'error' }

function readCallbackResult(): CallbackResult {
  const fragment = new URLSearchParams(window.location.hash.slice(1))
  const accessToken = fragment.get('accessToken')
  const newUserValue = fragment.get('newUser')

  if (!accessToken || (newUserValue !== 'true' && newUserValue !== 'false')) {
    return { status: 'error' }
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
      window.location.replace('/')
    }
  }, [result])

  if (result.status === 'error') {
    return (
      <main className="flex min-h-dvh min-h-screen items-center justify-center px-6 text-center">
        <section>
          <h1 className="text-lg font-bold text-neutral-950">로그인 정보를 확인하지 못했어요</h1>
          <p className="mt-2 text-sm text-neutral-600">로그인 화면에서 다시 시도해 주세요.</p>
          <button
            className="mt-6 min-h-11 rounded-full bg-neutral-950 px-6 text-sm font-bold text-white"
            onClick={() =>
              window.location.replace(import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:3000')
            }
            type="button"
          >
            로그인 화면으로 이동
          </button>
        </section>
      </main>
    )
  }

  return (
    <main
      aria-live="polite"
      className="flex min-h-dvh min-h-screen items-center justify-center px-6 text-center text-sm text-neutral-600"
      role="status"
    >
      로그인 완료 중…
    </main>
  )
}

export default OAuthCallbackPage
