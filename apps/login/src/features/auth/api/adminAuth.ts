import axios from 'axios'
import apiClient from '@/services/apiClient'

export type AdminAuthMode = 'login' | 'signup'

export interface AdminAuthCredentials {
  username: string
  password: string
}

export async function requestAdminAuth(mode: AdminAuthMode, credentials: AdminAuthCredentials) {
  const response = await apiClient.post(`/api/admin/auth/${mode}`, credentials)
  return response.data as unknown
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
