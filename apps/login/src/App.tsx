import { useEffect } from 'react'
import { useAuthStore } from '@repo/auth'
import LoginPage from '@/pages/LoginPage'

const userAppUrl = import.meta.env.VITE_USER_APP_URL || 'http://localhost:3001'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      window.location.replace(userAppUrl)
    }
  }, [isAuthenticated])

  if (isAuthenticated) {
    return (
      <main
        aria-live="polite"
        className="flex min-h-dvh min-h-screen items-center justify-center px-6 text-center text-sm text-neutral-600"
        role="status"
      >
        사용자 화면으로 이동 중…
      </main>
    )
  }

  return <LoginPage />
}

export default App
