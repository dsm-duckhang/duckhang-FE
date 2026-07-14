import { useEffect, useRef } from 'react'
import duck2Image from '../assets/duck2.png'
import AppIcon from '../AppIcon/AppIcon'
import type { AppIconName } from '../AppIcon/AppIcon'

const MENU_ID = 'app-side-menu'

type AppSideMenuItemLabel = '홈' | '랭킹' | '스탬프' | '행사' | '깃허브' | '마이페이지'

interface AppSideMenuItem {
  href?: string
  icon: AppIconName
  label: AppSideMenuItemLabel
}

const menuItems: readonly AppSideMenuItem[] = [
  { icon: 'home', label: '홈' },
  { icon: 'ranking', label: '랭킹' },
  { icon: 'stamp', label: '스탬프' },
  { icon: 'gift', label: '행사' },
  { href: 'https://github.com/dsm-duckhang', icon: 'badge', label: '깃허브' },
  { icon: 'chat', label: '마이페이지' },
]

interface AppSideMenuProps {
  disabledItems?: readonly AppSideMenuItemLabel[]
  isOpen: boolean
  onClose: () => void
  onItemSelect: (item: AppSideMenuItemLabel) => void
}

function AppSideMenu({ disabledItems = [], isOpen, onClose, onItemSelect }: AppSideMenuProps) {
  const firstItemRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstItemRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !menuRef.current) return

      const focusableItems = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)'),
      )
      const firstItem = focusableItems.at(0)
      const lastItem = focusableItems.at(-1)

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault()
        lastItem?.focus()
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault()
        firstItem?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      const menuButton = document.querySelector<HTMLButtonElement>(`[aria-controls="${MENU_ID}"]`)
      menuButton?.focus()
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

  const handleItemSelect = (item: AppSideMenuItemLabel) => {
    onItemSelect(item)
    onClose()
  }

  return (
    <section
      aria-hidden={!isOpen}
      aria-labelledby="app-side-menu-title"
      aria-modal="true"
      className={`fixed inset-x-0 top-17 bottom-0 z-30 mx-auto w-full max-w-[430px] overflow-y-auto overscroll-contain bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      id={MENU_ID}
      ref={menuRef}
      role="dialog"
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(calc(-100% - max(0px, 50vw - 215px)))',
      }}
    >
      <div className="flex items-center gap-5 bg-neutral-50 px-7 py-10">
        <img
          alt="손을 흔드는 덕행 캐릭터"
          className="size-28 shrink-0 object-contain"
          src={duck2Image}
        />
        <div className="min-w-0 tracking-[-0.04em]">
          <p className="text-[0.625rem] font-bold tracking-[0.12em] text-neutral-400 uppercase">
            Duckhang Journey
          </p>
          <h2
            className="mt-1.5 text-xl leading-tight font-black text-neutral-950"
            id="app-side-menu-title"
          >
            덕질로 떠나는 여행
          </h2>
          <p className="mt-3 text-xs font-semibold text-neutral-500">덕질을 통해 얻는</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold">
            <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-white">행복</span>
            <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-neutral-700">
              행운
            </span>
          </div>
        </div>
      </div>

      <nav aria-label="전체 메뉴" className="px-12 pt-12 pb-10">
        <ul className="grid grid-cols-2 gap-x-12 gap-y-10">
          {menuItems.map(({ href, icon, label }, index) => {
            const isDisabled = disabledItems.includes(label)
            const itemContent = (
              <>
                <span className="flex size-14 items-center justify-center rounded-2xl border border-neutral-100 bg-white text-neutral-500 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-[transform,color] group-hover:-translate-y-0.5 group-hover:text-neutral-950 group-disabled:transform-none group-disabled:text-neutral-300">
                  <AppIcon name={icon} size={29} />
                </span>
                <span>{label}</span>
              </>
            )

            return (
              <li className="flex justify-center" key={label}>
                {href ? (
                  <a
                    aria-label={`${label}, 새 탭에서 열기`}
                    className="group flex min-w-20 flex-col items-center gap-3 rounded-xl text-base font-bold tracking-[-0.03em] text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"
                    href={href}
                    onClick={onClose}
                    rel="noreferrer"
                    tabIndex={isOpen ? 0 : -1}
                    target="_blank"
                  >
                    {itemContent}
                  </a>
                ) : (
                  <button
                    aria-label={isDisabled ? `${label}, 준비 중` : label}
                    className="group flex min-w-20 flex-col items-center gap-3 rounded-xl text-base font-bold tracking-[-0.03em] text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950 disabled:cursor-not-allowed disabled:text-neutral-400"
                    disabled={!isOpen || isDisabled}
                    onClick={() => handleItemSelect(label)}
                    ref={index === 0 ? firstItemRef : undefined}
                    type="button"
                  >
                    {itemContent}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </section>
  )
}

export default AppSideMenu
export { MENU_ID }
export type { AppSideMenuItemLabel, AppSideMenuProps }
