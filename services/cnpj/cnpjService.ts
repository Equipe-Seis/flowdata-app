import { apiFetch } from '~/composables/useApi'

export async function fetchCnpj(cnpjClean: string): Promise<any> {
  return await apiFetch<any>(`/cnpj/${cnpjClean}`)
}


