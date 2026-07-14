import type { ReactNode } from 'react'

type AppIconName =
  | 'badge'
  | 'bell'
  | 'calendar'
  | 'chat'
  | 'close'
  | 'gift'
  | 'home'
  | 'location'
  | 'menu'
  | 'ranking'
  | 'search'
  | 'stamp'
  | 'user'

interface AppIconProps {
  name: AppIconName
  size?: number
}

const iconPaths: Record<AppIconName, ReactNode> = {
  badge: (
    <>
      <path d="m12 2 2.3 2.1 3.1-.2.7 3 2.6 1.7-1.2 2.9 1.2 2.9-2.6 1.7-.7 3-3.1-.2L12 22l-2.3-2.1-3.1.2-.7-3-2.6-1.7 1.2-2.9-1.2-2.9 2.6-1.7.7-3 3.1.2L12 2Z" />
      <path d="M12 8v5M12 16.5h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
  calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.7 9.7 0 0 1-3.8-.8L3 21l1.7-4.6A8.7 8.7 0 1 1 21 11.5Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  gift: (
    <>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13M3 12h18M7.5 8C5.5 8 4 7 4 5.5S5 3 6.5 3C9 3 12 8 12 8M16.5 8C18.5 8 20 7 20 5.5S19 3 17.5 3C15 3 12 8 12 8" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  location: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  ranking: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7" />
      <path d="m19 3 .8 1.7 1.9.3-1.4 1.3.4 1.9L19 8.3l-1.7.9.4-1.9L16.3 6l1.9-.3L19 3Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  stamp: (
    <>
      <path d="M8 14h8l2 3v3H6v-3l2-3Z" />
      <path d="M9 14V9a3 3 0 0 1 6 0v5M5 20h14" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
}

function AppIcon({ name, size = 24 }: AppIconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {iconPaths[name]}
      </g>
    </svg>
  )
}

export default AppIcon
export type { AppIconName, AppIconProps }
