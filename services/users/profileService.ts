import { apiFetch } from '~/composables/useApi'

export async function fetchProfiles(): Promise<{ id: number; name: string }[]> {
  return await apiFetch('/profiles')
}