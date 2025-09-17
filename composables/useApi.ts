

import { useRuntimeConfig } from 'nuxt/app'
import { useAuth } from './useAuth'

export const useApiFetch = async <T>(path: string, opts: any = {}): Promise<T> => {
  const config = useRuntimeConfig()
  const { getAuthHeader, tryRefresh } = useAuth()

  const url = path.startsWith('http') ? path : `${config.public.apiBase}${path.startsWith('/') ? '' : '/'}${path}`

  try {
    return await $fetch<T>(url, {
      ...opts,
      headers: {
        ...getAuthHeader(),
        ...(opts.headers || {})
      }
    })
  } catch (err: any) {
    if (err?.status === 401) {
      const refreshed = await tryRefresh()
      if (refreshed) {
        return await $fetch<T>(url, {
          ...opts,
          headers: {
            ...getAuthHeader(),
            ...(opts.headers || {})
          }
        })
      }
    }
    throw err
  }
}

export const apiFetch = useApiFetch


