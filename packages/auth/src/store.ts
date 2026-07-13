import { create } from 'zustand'
import { getAccessToken, getStoredAuthUser, removeAuthCookies, writeAuthCookies } from './cookies'
import type { AuthCookieOptions, AuthUser, OAuthCallbackSession } from './types'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  setSession: (data: OAuthCallbackSession, options?: AuthCookieOptions) => void
  clearSession: (options?: AuthCookieOptions) => void
}

const initialUser = getStoredAuthUser()
const isInitiallyAuthenticated = Boolean(initialUser && getAccessToken())

export const useAuthStore = create<AuthState>((set) => ({
  user: isInitiallyAuthenticated ? initialUser : null,
  isAuthenticated: isInitiallyAuthenticated,
  setSession: (data, options) => {
    writeAuthCookies(data, options)
    set({
      user: { userId: data.userId ?? null, newUser: data.newUser },
      isAuthenticated: true,
    })
  },
  clearSession: (options) => {
    removeAuthCookies(options)
    set({ user: null, isAuthenticated: false })
  },
}))

export function setAuthSession(data: OAuthCallbackSession, options?: AuthCookieOptions) {
  useAuthStore.getState().setSession(data, options)
}

export function clearAuthSession(options?: AuthCookieOptions) {
  useAuthStore.getState().clearSession(options)
}
