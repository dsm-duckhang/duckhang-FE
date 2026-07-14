import { BottomNavigation as SharedBottomNavigation } from '@repo/ui'
import { useLocation, useNavigate } from 'react-router-dom'

const navigationItems = [
  { icon: 'calendar', label: '행사' },
  { icon: 'home', label: '홈' },
  { icon: 'stamp', label: '스탬프', isDisabled: true },
  { icon: 'user', label: '마이페이지' },
] as const

type NavigationItemLabel = (typeof navigationItems)[number]['label']

function BottomNavigation() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentItem: NavigationItemLabel = pathname.startsWith('/events')
    ? '행사'
    : pathname === '/mypage'
      ? '마이페이지'
      : '홈'

  const handleItemSelect = (item: NavigationItemLabel) => {
    if (item === '행사') navigate('/events')
    if (item === '홈') navigate('/')
    if (item === '마이페이지') navigate('/mypage')
  }

  return (
    <SharedBottomNavigation
      currentItem={currentItem}
      items={navigationItems}
      onItemSelect={handleItemSelect}
    />
  )
}

export default BottomNavigation
