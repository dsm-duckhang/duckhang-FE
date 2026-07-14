import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader, BottomNavigation } from '@repo/ui'
import logo from '@/assets/images/logo.png'
import { navigationItems } from '@/components/BottomNavigation/navigationItems'
import type { NavigationItemLabel } from '@/components/BottomNavigation/navigationItems'
import GoogleLoginButton from '@/features/auth/GoogleLoginButton'

function LoginPage() {
  const toastExitTimerRef = useRef<number | null>(null)
  const toastRemoveTimerRef = useRef<number | null>(null)
  const [isToastExiting, setIsToastExiting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(
    () => () => {
      if (toastExitTimerRef.current !== null) {
        window.clearTimeout(toastExitTimerRef.current)
      }
      if (toastRemoveTimerRef.current !== null) {
        window.clearTimeout(toastRemoveTimerRef.current)
      }
    },
    [],
  )

  const handleNavigationSelect = (item: NavigationItemLabel) => {
    if (item === '홈') return

    setToastMessage(`${item} 메뉴는 로그인 후 이용할 수 있어요.`)
    setIsToastExiting(false)

    if (toastExitTimerRef.current !== null) {
      window.clearTimeout(toastExitTimerRef.current)
    }
    if (toastRemoveTimerRef.current !== null) {
      window.clearTimeout(toastRemoveTimerRef.current)
    }

    toastExitTimerRef.current = window.setTimeout(() => {
      setIsToastExiting(true)
      toastExitTimerRef.current = null
    }, 2280)

    toastRemoveTimerRef.current = window.setTimeout(() => {
      setToastMessage(null)
      setIsToastExiting(false)
      toastRemoveTimerRef.current = null
    }, 2500)
  }

  return (
    <div className="relative mx-auto flex min-h-dvh min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-[0_0_32px_rgba(0,0,0,0.06)]">
      <AppHeader hasMenuButton={false} logoSrc={logo} />

      <main className="flex flex-1 flex-col justify-center px-7 py-10 sm:px-9">
        <section aria-labelledby="login-title" className="w-full">
          <p className="mb-3 text-sm font-semibold tracking-[-0.02em] text-neutral-500">
            좋아하는 마음이 쌓이는 곳
          </p>
          <h1
            id="login-title"
            className="text-[1.75rem] leading-[1.3] font-black tracking-[-0.055em] text-neutral-950"
          >
            덕질은 소비가 아니라
            <span className="journey-title-enter mt-2 block w-fit rounded-xl bg-neutral-950 px-3 py-1.5 text-[2.55rem] leading-tight tracking-[-0.065em] text-white">
              ‘여행’이다.
            </span>
          </h1>
          <p className="mt-5 text-base leading-7 tracking-[-0.025em] text-neutral-600">
            좋아하는 마음이 경험이 되고,
            <br className="hidden min-[360px]:block" /> 그 순간들이 나만의 여정이 되는 곳이에요.
          </p>

          <div className="mt-12">
            <GoogleLoginButton />
            <div className="mx-auto mt-7 w-[72%] border-t border-neutral-200 pt-5 text-center">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold tracking-[-0.02em] text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
                to="/admin/login"
              >
                관리자 로그인
              </Link>
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation
        currentItem="홈"
        items={navigationItems}
        onItemSelect={handleNavigationSelect}
      />

      {toastMessage && (
        <div
          aria-live="polite"
          className={`${
            isToastExiting ? 'login-toast-exit' : 'login-toast-enter'
          } pointer-events-none absolute right-5 bottom-[calc(5.25rem+env(safe-area-inset-bottom)+0.75rem)] left-5 z-30 mx-auto max-w-sm rounded-2xl bg-neutral-900 px-5 py-3.5 text-center text-sm font-semibold tracking-[-0.02em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]`}
          role="status"
        >
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default LoginPage
