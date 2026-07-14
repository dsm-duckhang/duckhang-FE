import { create } from 'zustand'
import {
  getAdminAccessToken,
  getStoredAdminAuthUser,
  removeAdminAuthCookies,
  writeAdminAuthCookies,
} from './cookies'
import type { AdminAuthSession, AdminAuthUser, AuthCookieOptions } from './types'

interface AdminAuthState {
  user: AdminAuthUser | null
  isAuthenticated: boolean
  setSession: (data: AdminAuthSession, options?: AuthCookieOptions) => void
  clearSession: (options?: AuthCookieOptions) => void
}

const initialUser = getStoredAdminAuthUser()
const isInitiallyAuthenticated = Boolean(initialUser && getAdminAccessToken())

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: isInitiallyAuthenticated ? initialUser : null,
  isAuthenticated: isInitiallyAuthenticated,
  setSession: (data, options) => {
    writeAdminAuthCookies(data, options)
    set({
      user: { adminId: data.adminId ?? null, username: data.username },
      isAuthenticated: true,
    })
  },
  clearSession: (options) => {
    removeAdminAuthCookies(options)
    set({ user: null, isAuthenticated: false })
  },
}))

export function setAdminAuthSession(data: AdminAuthSession, options?: AuthCookieOptions) {
  useAdminAuthStore.getState().setSession(data, options)
}

export function clearAdminAuthSession(options?: AuthCookieOptions) {
  useAdminAuthStore.getState().clearSession(options)
}
