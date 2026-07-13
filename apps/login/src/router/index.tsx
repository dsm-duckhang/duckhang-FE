import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/oauth/callback',
    element: <OAuthCallbackPage />,
  },
])

export default router
