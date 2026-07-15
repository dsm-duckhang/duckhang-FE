import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import EventsPage from '@/pages/EventsPage'
import EventDetailPage from '@/pages/EventDetailPage'
import HomePage from '@/pages/HomePage'
import MyPage from '@/pages/MyPage'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage'
import StampPage from '@/pages/StampPage'

const router = createBrowserRouter([
  {
    path: '/oauth/callback',
    element: <OAuthCallbackPage />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'events/:id',
        element: <EventDetailPage />,
      },
      {
        path: 'stamp',
        element: <StampPage />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
    ],
  },
])

export default router
