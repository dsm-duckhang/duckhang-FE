import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import AdminHomePage from '@/pages/AdminHomePage'
import AdminPlaceholderPage from '@/pages/AdminPlaceholderPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <AdminHomePage />,
      },
      {
        path: 'events',
        element: (
          <AdminPlaceholderPage
            description="행사 등록과 관리 기능을 준비하고 있어요."
            title="행사"
          />
        ),
      },
      {
        path: 'stamps',
        element: (
          <AdminPlaceholderPage description="스탬프 관리 기능을 준비하고 있어요." title="스탬프" />
        ),
      },
      {
        path: 'mypage',
        element: (
          <AdminPlaceholderPage
            description="관리자 계정 관리 기능을 준비하고 있어요."
            title="마이페이지"
          />
        ),
      },
    ],
  },
])

export default router
