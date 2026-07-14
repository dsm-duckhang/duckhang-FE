import { useState } from 'react'
import { clearAdminAuthSession, useAdminAuthStore } from '@repo/auth'
import { requestAdminLogout } from '@/features/auth/api/logout'

const loginAppUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:3000'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

function AdminMyPage() {
  const user = useAdminAuthStore((state) => state.user)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await requestAdminLogout()
    } catch {
      // 토큰이 이미 만료되었거나 네트워크가 끊겨도 로컬 로그아웃은 완료한다.
    } finally {
      clearAdminAuthSession({ domain: cookieDomain })
      window.location.replace(`${loginAppUrl.replace(/\/+$/, '')}/admin/login`)
    }
  }

  return (
    <section className="flex flex-1 flex-col px-6 pt-10 pb-8" aria-labelledby="admin-mypage-title">
      <p className="text-sm font-bold text-neutral-400">관리자 계정</p>
      <h1
        className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950"
        id="admin-mypage-title"
      >
        {user?.username ?? '관리자'}
      </h1>

      <div className="mt-8 rounded-2xl border border-neutral-200 p-5">
        <p className="text-sm font-bold text-neutral-900">로그아웃</p>
        <p className="mt-2 text-xs leading-5 text-neutral-500">
          현재 관리자 세션을 종료하고 로그인 화면으로 이동합니다.
        </p>
        <button
          className="mt-5 min-h-11 w-full rounded-full bg-neutral-950 px-5 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-400"
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          {isLoggingOut ? '로그아웃 중…' : '로그아웃'}
        </button>
      </div>
    </section>
  )
}

export default AdminMyPage
