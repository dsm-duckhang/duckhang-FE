import { useCallback, useState } from 'react'
import AppHeader from '@/components/AppHeader'
import AppMenuSheet from '@/components/AppMenuSheet'
import BottomNavigation from '@/components/BottomNavigation'
import type { NavigationItemLabel } from '@/components/BottomNavigation'
import GoogleLoginButton from '@/features/auth/GoogleLoginButton'

function LoginPage() {
  const [currentItem, setCurrentItem] = useState<NavigationItemLabel>('홈')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  return (
    <div className="relative mx-auto flex min-h-dvh min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-[0_0_32px_rgba(0,0,0,0.06)]">
      <AppHeader onMenuClick={() => setIsMenuOpen(true)} />

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
            <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
              덕행은 Google 계정으로만 가입 및 로그인할 수 있어요.
            </p>
          </div>
        </section>
      </main>

      <BottomNavigation currentItem={currentItem} onItemSelect={setCurrentItem} />
      <AppMenuSheet
        currentItem={currentItem}
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onItemSelect={setCurrentItem}
      />
    </div>
  )
}

export default LoginPage
