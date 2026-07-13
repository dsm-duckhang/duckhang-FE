import googleLogo from '@/assets/images/google.svg'

function GoogleLoginButton() {
  return (
    <button
      className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-neutral-300 bg-white px-5 text-base font-bold text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 active:bg-neutral-100"
      type="button"
    >
      <img alt="" aria-hidden="true" className="size-7" src={googleLogo} />
      Google로 계속하기
    </button>
  )
}

export default GoogleLoginButton
