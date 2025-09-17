


import { useRuntimeConfig } from 'nuxt/app'
import { apiFetch } from '~/composables/useApi'
import type { UserMe } from '~/models/User/User'

export async function fetchCurrentUser(): Promise<UserMe> {
  return await apiFetch<UserMe>('/users/me')
}


