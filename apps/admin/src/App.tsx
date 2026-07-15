import { useEffect, useState } from 'react'
import {
  clearAdminAuthSession,
  getAdminAccessToken,
  isAccessTokenExpired,
  useAdminAuthStore,
} from '@repo/auth'
import { AppHeader, AppSideMenu } from '@repo/ui'
import type { AppSideMenuItemLabel } from '@repo/ui'
import { Outlet, useNavigate } from 'react-router-dom'
import logo from '@/assets/images/logo.png'
import BottomNavigation from '@/components/BottomNavigation'

const loginAppUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:3000'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

function getSessionExpiredRedirectUrl() {
  const url = new URL('/admin/login', loginAppUrl)
  url.searchParams.set('authError', 'session_expired')
  return url.toString()
}

function App() {
  const navigate = useNavigate()
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const accessToken = getAdminAccessToken()
  const hasValidSession = Boolean(
    isAuthenticated && accessToken && !isAccessTokenExpired(accessToken),
  )

  const handleMenuItemSelect = (item: AppSideMenuItemLabel) => {
    if (item === '랭킹') {
      navigate('/#popular-ranking-title')
      window.setTimeout(() => {
        document.getElementById('popular-ranking-title')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        })
      }, 0)
      return
    }

    const menuPaths: Partial<Record<AppSideMenuItemLabel, string>> = {
      홈: '/',
      스탬프: '/stamps',
      행사: '/events',
      마이페이지: '/mypage',
    }
    const path = menuPaths[item]
    if (path) navigate(path)
  }

  useEffect(() => {
    if (hasValidSession) {
      return
    }

    clearAdminAuthSession({ domain: cookieDomain })
    window.location.replace(getSessionExpiredRedirectUrl())
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
      <AppHeader
        isMenuOpen={isMenuOpen}
        logoSrc={logo}
        menuLabel={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        onMenuClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <BottomNavigation />
      <AppSideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onItemSelect={handleMenuItemSelect}
      />
    </div>
  )
}

export default App
