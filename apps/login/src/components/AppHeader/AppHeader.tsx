import logo from '@/assets/images/logo.png'
import IconPlaceholder from '@/components/IconPlaceholder'

const iconButtonClassName =
  'flex size-11 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950'

interface AppHeaderProps {
  onMenuClick: () => void
}

function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="grid h-17 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-neutral-100 bg-white px-3">
      <div className="flex justify-start">
        <button
          aria-label="메뉴 열기"
          className={iconButtonClassName}
          onClick={onMenuClick}
          type="button"
        >
          <IconPlaceholder name="menu" />
        </button>
      </div>

      <img alt="덕행" className="size-10 rounded-xl object-cover" src={logo} />

      <div />
    </header>
  )
}

export default AppHeader
