import { useEffect, useState } from 'react'
import { setAdminAuthSession } from '@repo/auth'

const loginAppUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:3000'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

type CallbackResult =
  | { status: 'success'; accessToken: string; adminId?: string; username: string }
  | { status: 'error' }

function readCallbackResult(): CallbackResult {
  const fragment = new URLSearchParams(window.location.hash.slice(1))
  const accessToken = fragment.get('accessToken')
  const adminId = fragment.get('adminId') || undefined
  const username = fragment.get('username')

  if (!accessToken || !username) {
    return { status: 'error' }
  }

  return { status: 'success', accessToken, adminId, username }
}

function AdminAuthCallbackPage() {
  const [result] = useState(readCallbackResult)

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname)

    if (result.status === 'success') {
      setAdminAuthSession(result, { domain: cookieDomain })
      window.location.replace('/')
    }
  }, [result])

  if (result.status === 'error') {
    return (
      <main className="flex min-h-dvh min-h-screen items-center justify-center px-6 text-center">
        <section>
          <h1 className="text-lg font-bold text-neutral-950">
            관리자 로그인 정보를 확인하지 못했어요
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            관리자 로그인 화면에서 다시 시도해 주세요.
          </p>
          <button
            className="mt-6 min-h-11 rounded-full bg-neutral-950 px-6 text-sm font-bold text-white"
            onClick={() =>
              window.location.replace(`${loginAppUrl.replace(/\/+$/, '')}/admin/login`)
            }
            type="button"
          >
            관리자 로그인으로 이동
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
      관리자 로그인 완료 중…
    </main>
  )
}

export default AdminAuthCallbackPage
