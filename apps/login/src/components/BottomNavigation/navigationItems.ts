const navigationItems = [
  { label: '행사', icon: 'calendar' },
  { label: '홈', icon: 'home' },
  { label: '스탬프', icon: 'stamp' },
  { label: '마이페이지', icon: 'user' },
] as const

type NavigationItemLabel = (typeof navigationItems)[number]['label']

export { navigationItems }
export type { NavigationItemLabel }
