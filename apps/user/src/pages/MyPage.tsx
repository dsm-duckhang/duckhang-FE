import { clearAuthSession } from '@repo/auth'
import duckImage from '@repo/ui/assets/duck'

const loginAppUrl = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:3000'
const cookieDomain = import.meta.env.VITE_AUTH_COOKIE_DOMAIN?.trim() || undefined

const activityStats = [
  { label: '스탬프', value: 9 },
  { label: '참여행사', value: 3 },
] as const

function MyPage() {
  const handleLogout = () => {
    clearAuthSession({ domain: cookieDomain })
    window.location.replace(loginAppUrl)
  }

  return (
    <section className="flex min-h-[calc(100dvh-9.5rem)] flex-col px-4 pt-5 pb-8">
      <div className="flex items-center gap-3 px-1">
        <span aria-hidden="true" className="size-14 shrink-0 rounded-full bg-[#f0eee8]" />
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold tracking-[-0.03em] text-neutral-900">
            덕행러 님
          </h1>
          <span className="mt-1 inline-flex rounded-full bg-neutral-950 px-2 py-0.5 text-[0.625rem] font-semibold text-white">
            Lv.3 여행자
          </span>
        </div>
      </div>

      <dl className="mt-5 grid h-16 grid-cols-2 overflow-hidden rounded-xl border border-[#d8d3cb]">
        {activityStats.map(({ label, value }, index) => (
          <div
            className={`flex flex-col items-center justify-center ${
              index > 0 ? 'border-l border-[#e4e0da]' : ''
            }`}
            key={label}
          >
            <dt className="order-2 mt-1.5 text-[0.625rem] leading-none text-neutral-500">
              {label}
            </dt>
            <dd className="order-1 text-base leading-none font-medium text-neutral-900 tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <button
        className="mt-2.5 ml-auto min-h-11 rounded-lg px-1 text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        onClick={handleLogout}
        type="button"
      >
        로그아웃
      </button>

      <div className="mt-auto flex justify-center pt-8 pb-2">
        <img
          alt=""
          aria-hidden="true"
          className="w-80 max-w-[84vw] object-contain"
          draggable={false}
          src={duckImage}
        />
      </div>
    </section>
  )
}

export default MyPage
