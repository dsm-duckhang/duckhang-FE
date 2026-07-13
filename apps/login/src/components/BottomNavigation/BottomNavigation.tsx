import IconPlaceholder from '@/components/IconPlaceholder'
import { navigationItems } from './navigationItems'
import type { NavigationItemLabel } from './navigationItems'

interface BottomNavigationProps {
  currentItem: NavigationItemLabel
  onItemSelect: (item: NavigationItemLabel) => void
}

function BottomNavigation({ currentItem, onItemSelect }: BottomNavigationProps) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="shrink-0 border-t border-neutral-100 bg-white px-4 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid h-20 grid-cols-4">
        {navigationItems.map(({ icon, label }) => {
          const isCurrent = currentItem === label

          return (
            <li className="flex" key={label}>
              <button
                aria-current={isCurrent ? 'page' : undefined}
                className={`flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-neutral-950 ${
                  isCurrent ? 'text-neutral-950' : 'text-neutral-500 hover:text-neutral-800'
                }`}
                onClick={() => onItemSelect(label)}
                type="button"
              >
                <span
                  className={isCurrent ? 'rounded-full bg-neutral-950 p-1.5 text-white' : 'p-1.5'}
                >
                  <IconPlaceholder name={icon} size={22} />
                </span>
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomNavigation
