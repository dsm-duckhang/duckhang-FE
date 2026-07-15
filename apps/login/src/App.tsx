import { useEffect } from 'react'
import {
  clearAuthSession,
  clearAdminAuthSession,
  getAccessToken,
  getAdminAccessToken,
  isAccessTokenExpired,
  useAdminAuthStore,
  useAuthStore,
} from '@repo/auth'
import LoginPage from '@/pages/LoginPage'

const userAppUrl = import.meta.env.VITE_USER_APP_URL || 'http://localhost:3001'
const adminAppUrl = import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:3002'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

function App() {
  const hasSessionExpiredError =
    new URLSearchParams(window.location.search).get('authError') === 'session_expired'
  const isUserAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isAdminAuthenticated = useAdminAuthStore((state) => state.isAuthenticated)
  const accessToken = getAccessToken()
  const hasValidUserSession = Boolean(
    !hasSessionExpiredError &&
    isUserAuthenticated &&
    accessToken &&
    !isAccessTokenExpired(accessToken),
  )
  const adminAccessToken = getAdminAccessToken()
  const hasValidAdminSession = Boolean(
    isAdminAuthenticated && adminAccessToken && !isAccessTokenExpired(adminAccessToken),
  )

  useEffect(() => {
    if (hasValidUserSession) {
      window.location.replace(userAppUrl)
      return
    }

    if (hasValidAdminSession) {
      window.location.replace(adminAppUrl)
      return
    }

    if (isAdminAuthenticated) {
      clearAdminAuthSession({ domain: cookieDomain })
    }

    if (isUserAuthenticated) {
      clearAuthSession({ domain: cookieDomain })
    }
  }, [hasValidUserSession, hasValidAdminSession, isAdminAuthenticated, isUserAuthenticated])

  if (hasValidUserSession || hasValidAdminSession) {
    return (
      <main
        aria-live="polite"
        className="flex min-h-dvh min-h-screen items-center justify-center px-6 text-center text-sm text-neutral-600"
        role="status"
      >
        로그인된 화면으로 이동 중…
      </main>
    )
  }

  return <LoginPage />
}

export default App
