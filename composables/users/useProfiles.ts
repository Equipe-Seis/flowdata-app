import { ref } from 'vue'
import type { Profile } from '~/models/users/UsersDetail'   
import { fetchProfiles } from '~/services/users/profileService'

export const useProfiles = () => {
  const list = ref<Profile[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      const profiles = await fetchProfiles()
      list.value = profiles
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar perfis'
    } finally {
      loading.value = false
    }
  }

  return {
    list,
    loading,
    error,
    load
  }
}
