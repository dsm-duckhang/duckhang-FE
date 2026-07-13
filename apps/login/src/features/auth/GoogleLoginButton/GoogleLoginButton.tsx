import { useState } from 'react'
import googleLogo from '@/assets/images/google.svg'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'https://keenness-kinetic-improper.ngrok-free.dev'
).replace(/\/+$/, '')
const googleOAuthUrl = `${apiBaseUrl}/api/auth/google/login`

function GoogleLoginButton() {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const startGoogleLogin = () => {
    setIsRedirecting(true)
    window.location.assign(googleOAuthUrl)
  }

  return (
    <button
      aria-label="Google로 계속하기"
      className="-mx-2 flex h-[72px] w-[calc(100%+1rem)] items-center justify-center gap-4 rounded-[22px] border border-neutral-200 bg-white px-7 text-[1.05rem] font-bold tracking-[-0.025em] text-neutral-900 shadow-[0_2px_7px_rgba(0,0,0,0.15)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-neutral-950 active:translate-y-0 active:bg-neutral-100 disabled:cursor-wait disabled:opacity-65"
      disabled={isRedirecting}
      onClick={startGoogleLogin}
      type="button"
    >
      <img alt="" aria-hidden="true" className="size-9 shrink-0" src={googleLogo} />
      <span>{isRedirecting ? 'Google로 이동 중…' : 'Google로 계속하기'}</span>
    </button>
  )
}

export default GoogleLoginButton
