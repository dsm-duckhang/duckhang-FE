import { useEffect, useRef, useState } from 'react'
import AppIcon from '../AppIcon/AppIcon'

const HEADER_HEIGHT = 68
const SCROLL_DIRECTION_THRESHOLD = 6

interface AppHeaderProps {
  logoAlt?: string
  logoSrc: string
  menuLabel?: string
  onMenuClick?: () => void
  isMenuDisabled?: boolean
  hasMenuButton?: boolean
}

function AppHeader({
  hasMenuButton = true,
  isMenuDisabled = false,
  logoAlt = '덕행',
  logoSrc,
  menuLabel = '메뉴 열기',
  onMenuClick,
}: AppHeaderProps) {
  const lastScrollYRef = useRef(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    lastScrollYRef.current = Math.max(window.scrollY, 0)

    const handleScroll = () => {
      const currentScrollY = Math.max(window.scrollY, 0)
      const scrollDelta = currentScrollY - lastScrollYRef.current

      if (currentScrollY <= HEADER_HEIGHT) {
        setIsVisible(true)
        lastScrollYRef.current = currentScrollY
        return
      }

      if (Math.abs(scrollDelta) < SCROLL_DIRECTION_THRESHOLD) return

      setIsVisible(scrollDelta < 0)
      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-20 grid h-17 shrink-0 grid-cols-[3rem_1fr_3rem] items-center border-b border-neutral-100 bg-white px-4 transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {hasMenuButton ? (
        <button
          aria-label={menuLabel}
          className={`flex size-11 items-center justify-center rounded-xl text-neutral-950 ${
            isMenuDisabled
              ? 'cursor-not-allowed'
              : 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950'
          }`}
          disabled={isMenuDisabled}
          onClick={onMenuClick}
          type="button"
        >
          <AppIcon name="menu" size={25} />
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
      <img alt={logoAlt} className="mx-auto size-10 rounded-xl object-cover" src={logoSrc} />
      <span aria-hidden="true" />
    </header>
  )
}

export default AppHeader
export type { AppHeaderProps }
