import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import AdminAuthPage from '@/pages/AdminAuthPage'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/admin/signup',
    element: <AdminAuthPage mode="signup" />,
  },
  {
    path: '/admin/login',
    element: <AdminAuthPage mode="login" />,
  },
  {
    path: '/oauth/callback',
    element: <OAuthCallbackPage />,
  },
])

export default router
