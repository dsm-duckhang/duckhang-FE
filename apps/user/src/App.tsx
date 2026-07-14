import { useEffect, useState } from 'react'
import {
  clearAuthSession,
  isAccessTokenExpired,
  refreshAuthSession,
  useAuthStore,
} from '@repo/auth'
import { AppHeader } from '@repo/ui'
import { Outlet } from 'react-router-dom'
import logo from '@/assets/images/logo.png'
import BottomNavigation from '@/components/BottomNavigation'

const loginAppUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:3000'
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    let isActive = true

    async function restoreSession() {
      if (isAuthenticated && !isAccessTokenExpired()) {
        setIsCheckingSession(false)
        return
      }

      try {
        await refreshAuthSession({ apiBaseUrl, domain: cookieDomain })
        if (isActive) {
          setIsCheckingSession(false)
        }
      } catch {
        clearAuthSession({ domain: cookieDomain })
        window.location.replace(loginAppUrl)
      }
    }

    void restoreSession()

    return () => {
      isActive = false
    }
  }, [isAuthenticated])

  if (isCheckingSession || !isAuthenticated) {
    return (
      <main className="flex min-h-dvh min-h-screen items-center justify-center px-6 text-center text-sm text-neutral-600">
        로그인 상태 확인 중…
      </main>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh min-h-screen w-full max-w-[430px] flex-col bg-white shadow-[0_0_32px_rgba(0,0,0,0.06)]">
      <AppHeader isMenuDisabled logoSrc={logo} menuLabel="메뉴 준비 중" />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}

export default App
