import AppIcon from '../AppIcon/AppIcon'
import type { AppIconName } from '../AppIcon/AppIcon'

interface BottomNavigationItem<ItemLabel extends string = string> {
  icon: AppIconName
  label: ItemLabel
  isDisabled?: boolean
}

interface BottomNavigationProps<ItemLabel extends string = string> {
  currentItem: ItemLabel
  items: readonly BottomNavigationItem<ItemLabel>[]
  onItemSelect?: (item: ItemLabel) => void
}

function BottomNavigation<ItemLabel extends string>({
  currentItem,
  items,
  onItemSelect,
}: BottomNavigationProps<ItemLabel>) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="sticky bottom-0 z-20 shrink-0 border-t border-neutral-100 bg-white px-3 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid h-21 grid-cols-4">
        {items.map(({ icon, isDisabled = false, label }) => {
          const isCurrent = currentItem === label

          return (
            <li className="flex min-w-0" key={label}>
              <button
                aria-current={isCurrent ? 'page' : undefined}
                className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-neutral-950 disabled:cursor-not-allowed"
                disabled={isDisabled}
                onClick={() => onItemSelect?.(label)}
                type="button"
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-full ${
                    isCurrent ? 'bg-neutral-800 text-white' : 'text-neutral-300'
                  }`}
                >
                  <AppIcon name={icon} size={22} />
                </span>
                <span className={isCurrent ? 'text-neutral-800' : 'text-neutral-500'}>{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomNavigation
export type { BottomNavigationItem, BottomNavigationProps }
