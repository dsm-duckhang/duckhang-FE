import { BottomNavigation as SharedBottomNavigation } from '@repo/ui'
import { useLocation, useNavigate } from 'react-router-dom'

const navigationItems = [
  { icon: 'calendar', label: '행사' },
  { icon: 'home', label: '홈' },
  { icon: 'stamp', label: '스탬프' },
  { icon: 'user', label: '마이페이지' },
] as const

type NavigationItemLabel = (typeof navigationItems)[number]['label']

const navigationPaths: Record<NavigationItemLabel, string> = {
  행사: '/events',
  홈: '/',
  스탬프: '/stamps',
  마이페이지: '/mypage',
}

function BottomNavigation() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentItem =
    (Object.entries(navigationPaths).find(([, path]) =>
      path === '/events' ? pathname.startsWith(path) : path === pathname,
    )?.[0] as NavigationItemLabel | undefined) ?? '홈'

  return (
    <SharedBottomNavigation
      currentItem={currentItem}
      items={navigationItems}
      onItemSelect={(item) => navigate(navigationPaths[item])}
    />
  )
}

export default BottomNavigation
