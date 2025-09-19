import { ref } from 'vue'
import { createUser as createUserService, fetchUserById } from '~/services/users/userManagementService'
import type { CreateUserPayload, User } from '~/models/user/User'

export function useUser() {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const selected = ref<User | null>(null)
 
  async function getById(id: number | string): Promise<User | null> {
    loading.value = true
    error.value = null
    try {
      const user = await fetchUserById(id)
      selected.value = user
      return user
    } catch (err: any) {
      error.value = err
      console.error('Erro ao buscar usuário:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    getById,
    selected,
    loading,
    error
  }
}
