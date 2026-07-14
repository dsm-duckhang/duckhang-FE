import axios from 'axios'
import type { AdminAuthSession } from '@repo/auth'
import apiClient from '@/services/apiClient'

export type AdminAuthMode = 'login' | 'signup'

export interface AdminAuthCredentials {
  username: string
  password: string
}

function parseAdminAuthSession(payload: unknown, username: string): AdminAuthSession {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('관리자 로그인 응답이 올바르지 않아요.')
  }

  const responseData = Reflect.get(payload, 'data')
  const sessionPayload =
    typeof responseData === 'object' && responseData !== null ? responseData : payload
  const accessToken = Reflect.get(sessionPayload, 'accessToken')
  const adminIdValue = Reflect.get(sessionPayload, 'adminId') ?? Reflect.get(sessionPayload, 'id')

  if (typeof accessToken !== 'string' || !accessToken) {
    throw new Error('관리자 로그인 응답에 access token이 없어요.')
  }

  const adminId =
    typeof adminIdValue === 'number' || typeof adminIdValue === 'string' ? adminIdValue : undefined

  return { accessToken, adminId, username }
}

export async function requestAdminAuth(mode: AdminAuthMode, credentials: AdminAuthCredentials) {
  const response = await apiClient.post(`/api/admin/auth/${mode}`, credentials)

  if (mode === 'signup') {
    return null
  }

  return parseAdminAuthSession(response.data, credentials.username)
}

function readErrorMessage(payload: unknown) {
  if (typeof payload !== 'object' || payload === null) {
    return null
  }

  const error = Reflect.get(payload, 'error')

  if (typeof error === 'object' && error !== null) {
    const message = Reflect.get(error, 'message')
    return typeof message === 'string' ? message : null
  }

  const message = Reflect.get(payload, 'message')
  return typeof message === 'string' ? message : null
}

export function getAdminAuthErrorMessage(error: unknown, fallbackMessage: string) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallbackMessage
  }

  const responseMessage = readErrorMessage(error.response?.data)
  const statusSuffix = error.response?.status ? ` (${error.response.status})` : ''

  return responseMessage ?? `${fallbackMessage}${statusSuffix}`
}
