import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import EventsPage from '@/pages/EventsPage'
import HomePage from '@/pages/HomePage'
import MyPage from '@/pages/MyPage'
import StampPage from '@/pages/StampPage'

const router = createBrowserRouter([
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
