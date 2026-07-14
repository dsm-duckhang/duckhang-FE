import { useEffect } from 'react'
import {
  clearAdminAuthSession,
  getAdminAccessToken,
  isAccessTokenExpired,
  useAdminAuthStore,
} from '@repo/auth'
import { AppHeader } from '@repo/ui'
import { Outlet } from 'react-router-dom'
import logo from '@/assets/images/logo.png'
import BottomNavigation from '@/components/BottomNavigation'

const loginAppUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:3000'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

function App() {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated)
  const accessToken = getAdminAccessToken()
  const hasValidSession = Boolean(
    isAuthenticated && accessToken && !isAccessTokenExpired(accessToken),
  )

  useEffect(() => {
    if (hasValidSession) {
      return
    }

    clearAdminAuthSession({ domain: cookieDomain })
    window.location.replace(`${loginAppUrl.replace(/\/+$/, '')}/admin/login`)
  }, [hasValidSession])

  if (!hasValidSession) {
    return (
      <main
        aria-live="polite"
        className="flex min-h-dvh min-h-screen items-center justify-center px-6 text-center text-sm text-neutral-600"
        role="status"
      >
        관리자 로그인 상태 확인 중…
      </main>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh min-h-screen w-full max-w-[430px] flex-col bg-white shadow-[0_0_32px_rgba(0,0,0,0.06)]">
      <AppHeader isMenuDisabled logoSrc={logo} menuLabel="메뉴 준비 중" />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}

export default App
