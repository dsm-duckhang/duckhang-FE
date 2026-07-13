import { useEffect, useState } from 'react'
import {
  clearAuthSession,
  isAccessTokenExpired,
  refreshAuthSession,
  useAuthStore,
} from '@repo/auth'

const loginAppUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:3000'
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
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

  if (isCheckingSession || !isAuthenticated || !user) {
    return (
      <main className="flex min-h-dvh min-h-screen items-center justify-center px-6 text-center text-sm text-neutral-600">
        로그인 상태 확인 중…
      </main>
    )
  }

  return (
    <main className="flex min-h-dvh min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-2xl font-bold text-neutral-950">사용자 홈</h1>
      <p className="text-sm text-neutral-600">
        {user.newUser ? '가입이 완료됐어요.' : '다시 만나서 반가워요.'}
      </p>
    </main>
  )
}

export default App
