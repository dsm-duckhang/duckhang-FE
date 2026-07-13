import { useEffect } from 'react'
import { navigationItems } from '@/components/BottomNavigation'
import type { NavigationItemLabel } from '@/components/BottomNavigation'
import IconPlaceholder from '@/components/IconPlaceholder'

interface AppMenuSheetProps {
  currentItem: NavigationItemLabel
  isOpen: boolean
  onClose: () => void
  onItemSelect: (item: NavigationItemLabel) => void
}

function AppMenuSheet({ currentItem, isOpen, onClose, onItemSelect }: AppMenuSheetProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleItemSelect = (item: NavigationItemLabel) => {
    onItemSelect(item)
    onClose()
  }

  return (
    <div className="absolute inset-0 z-20 flex items-end">
      <button
        aria-label="메뉴 닫기"
        className="menu-backdrop-enter absolute inset-0 cursor-default bg-neutral-950/45"
        onClick={onClose}
        type="button"
      />

      <section
        aria-labelledby="menu-sheet-title"
        aria-modal="true"
        className="menu-sheet-enter relative z-10 w-full rounded-t-[2rem] bg-white px-6 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(0,0,0,0.12)]"
        role="dialog"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="menu-sheet-title"
              className="text-xl font-black tracking-[-0.04em] text-neutral-950"
            >
              덕행 메뉴
            </h2>
            <p className="mt-1 text-sm text-neutral-500">원하는 메뉴를 선택해 주세요.</p>
          </div>
          <button
            aria-label="메뉴 닫기"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
            onClick={onClose}
            type="button"
          >
            <IconPlaceholder name="close" />
          </button>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3">
          {navigationItems.map(({ icon, label }) => {
            const isCurrent = currentItem === label

            return (
              <li key={label}>
                <button
                  aria-pressed={isCurrent}
                  className={`flex h-20 w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 ${
                    isCurrent
                      ? 'border-neutral-950 bg-neutral-950 text-white'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                  onClick={() => handleItemSelect(label)}
                  type="button"
                >
                  <IconPlaceholder name={icon} size={24} />
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export default AppMenuSheet
