import AppIcon from '../AppIcon/AppIcon'

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
  return (
    <header className="sticky top-0 z-20 grid h-17 shrink-0 grid-cols-[3rem_1fr_3rem] items-center border-b border-neutral-100 bg-white px-4">
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
