import logo from '@/assets/images/logo.png'

function AppHeader() {
  return (
    <header className="flex h-17 shrink-0 items-center justify-center border-b border-neutral-100 bg-white px-3">
      <img alt="덕행" className="size-10 rounded-xl object-cover" src={logo} />
    </header>
  )
}

export default AppHeader
