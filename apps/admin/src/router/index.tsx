import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import AdminEventsPage from '@/pages/AdminEventsPage'
import AdminEventCreatePage from '@/pages/AdminEventCreatePage'
import AdminEventDetailPage from '@/pages/AdminEventDetailPage'
import AdminEventEditPage from '@/pages/AdminEventEditPage'
import AdminHomePage from '@/pages/AdminHomePage'
import AdminAuthCallbackPage from '@/pages/AdminAuthCallbackPage'
import AdminMyPage from '@/pages/AdminMyPage'
import AdminPlaceholderPage from '@/pages/AdminPlaceholderPage'

const router = createBrowserRouter([
  {
    path: '/auth/callback',
    element: <AdminAuthCallbackPage />,
  },
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
        element: <AdminEventsPage />,
      },
      {
        path: 'events/new',
        element: <AdminEventCreatePage />,
      },
      {
        path: 'events/:id',
        element: <AdminEventDetailPage />,
      },
      {
        path: 'events/:id/edit',
        element: <AdminEventEditPage />,
      },
      {
        path: 'stamps',
        element: (
          <AdminPlaceholderPage description="스탬프 관리 기능을 준비하고 있어요." title="스탬프" />
        ),
      },
      {
        path: 'mypage',
        element: <AdminMyPage />,
      },
    ],
  },
])

export default router
