import type { ReactNode } from 'react'

type StampIconName = 'arch' | 'camera' | 'cup' | 'gift' | 'heart' | 'megaphone' | 'star' | 'ticket'

interface StampIconProps {
  name: StampIconName
}

const stampIconPaths: Record<StampIconName, ReactNode> = {
  arch: (
    <>
      <path d="M5 20V9.5M19 20V9.5M4 20h16M7 9.5V6.7L9.5 4h5L17 6.7v2.8M9 20v-5.5a3 3 0 0 1 6 0V20M4 9.5h16M7 7h2M15 7h2" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8.5h3l1.4-2h7.2l1.4 2h3a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 4 8.5Z" />
      <circle cx="12" cy="14" r="3.2" />
    </>
  ),
  cup: (
    <>
      <path d="M5 10h12v4.5A4.5 4.5 0 0 1 12.5 19h-3A4.5 4.5 0 0 1 5 14.5V10ZM17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 3.5c-1 1-.7 2.1.3 3M12 3.5c-1 1-.7 2.1.3 3" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13M3 12h18M7.5 8C5.5 8 4 7 4 5.5S5 3 6.5 3C9 3 12 8 12 8M16.5 8C18.5 8 20 7 20 5.5S19 3 17.5 3C15 3 12 8 12 8" />
    </>
  ),
  heart: (
    <path d="M20.8 5.8a5.2 5.2 0 0 0-7.4 0L12 7.2l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 22l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z" />
  ),
  megaphone: (
    <>
      <path d="m4 13 13-7v12L4 13ZM4 13v4h4l2 4h3l-2-6" />
      <path d="M20 8.5v7" />
    </>
  ),
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  ticket: (
    <>
      <path d="M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V7Z" />
      <path d="M12 7v2M12 12v1M12 16v3" />
    </>
  ),
}

function StampIcon({ name }: StampIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="size-7"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
        {stampIconPaths[name]}
      </g>
    </svg>
  )
}

const earnedStamps: readonly StampIconName[] = [
  'arch',
  'megaphone',
  'cup',
  'gift',
  'star',
  'ticket',
  'camera',
  'heart',
]

const totalStampCount = 12

function LockIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
        <rect height="10" rx="1.5" width="12" x="6" y="11" />
        <path d="M9 11V8a3 3 0 0 1 6 0v3M12 15v2" />
      </g>
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
        <path d="M19 10c0 4.5-7 10.5-7 10.5S5 14.5 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.2" />
        <path d="M7.5 19.5C4.8 20 3 20.8 3 22h18c0-1.2-1.8-2-4.5-2.5" />
      </g>
    </svg>
  )
}

function MedalIcon() {
  return (
    <svg aria-hidden="true" className="size-9 text-[#ffc84c]" fill="none" viewBox="0 0 32 32">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <circle cx="16" cy="12" r="7" />
        <path d="m11 18-3 9 5-2 3 4 2-8M21 18l3 9-5-2-3 4" />
      </g>
    </svg>
  )
}

function StampPage() {
  const lockedStampCount = totalStampCount - earnedStamps.length - 1

  return (
    <section aria-labelledby="stamp-title" className="px-5 pt-12 pb-12">
      <header>
        <h1
          className="text-2xl leading-tight font-black tracking-[-0.045em] text-neutral-950"
          id="stamp-title"
        >
          스탬프
        </h1>
        <p className="mt-1 text-[0.95rem] font-medium tracking-[-0.025em] text-stone-300">
          여정을 채울수록 레벨이 올라가요
        </p>
      </header>

      <section
        aria-label="현재 스탬프 레벨"
        className="mt-6 rounded-[1.6rem] bg-black px-5 py-5 text-white"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-medium text-neutral-300">현재 레벨</p>
            <p className="mt-1 text-[1.4rem] leading-tight font-black tracking-[-0.04em]">
              Lv.3 여행자
            </p>
          </div>
          <MedalIcon />
        </div>

        <div
          aria-label="다음 레벨 진행률 46퍼센트"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={46}
          className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-700"
          role="progressbar"
        >
          <span className="block h-full w-[46%] rounded-full bg-white" />
        </div>
        <p className="mt-2 text-xs font-medium tracking-[-0.025em] text-neutral-300">
          다음 레벨까지 스탬프 4개 남았어요
        </p>
      </section>

      <section aria-labelledby="my-stamps-title" className="mt-5">
        <h2 className="text-sm font-bold tracking-[-0.035em] text-neutral-950" id="my-stamps-title">
          내 스탬프 ( {earnedStamps.length + 1} )
        </h2>

        <ul className="mt-3 grid grid-cols-4 gap-2.5">
          {earnedStamps.map((stamp, index) => (
            <li
              aria-label={`획득한 스탬프 ${index + 1}`}
              className="flex aspect-square items-center justify-center rounded-[1.35rem] bg-black text-white"
              key={`${stamp}-${index}`}
            >
              <StampIcon name={stamp} />
            </li>
          ))}
          {Array.from({ length: lockedStampCount }, (_, index) => (
            <li
              aria-label={`잠긴 스탬프 ${index + 1}`}
              className="flex aspect-square items-center justify-center rounded-[1.35rem] border border-neutral-400 bg-white text-neutral-950"
              key={`locked-${index}`}
            >
              <LockIcon />
            </li>
          ))}
          <li>
            <button
              aria-label="스탬프 추가"
              className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-[1.35rem] border border-neutral-400 bg-white text-4xl font-light text-neutral-950 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
              type="button"
            >
              +
            </button>
          </li>
        </ul>
      </section>

      <button
        className="mt-8 flex min-h-16 w-full cursor-pointer items-center gap-4 rounded-2xl px-6 text-left transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
        type="button"
      >
        <LocationIcon />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold tracking-[-0.035em] text-neutral-950">
            근처 행사에서 스탬프 받기
          </span>
          <span className="mt-0.5 block text-xs font-semibold tracking-[-0.025em] text-stone-300">
            현재 위치를 인증하면 스탬프가 찍혀요
          </span>
        </span>
        <span aria-hidden="true" className="text-3xl font-light text-stone-400">
          ›
        </span>
      </button>
    </section>
  )
}

export default StampPage
