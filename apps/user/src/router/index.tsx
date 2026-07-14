import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import EventsPage from '@/pages/EventsPage'
import HomePage from '@/pages/HomePage'

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
    ],
  },
])

export default router
