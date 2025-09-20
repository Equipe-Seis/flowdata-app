import { ref } from 'vue'
import { createUser as createUserService } from '~/services/users/userManagementService'
import type {  User } from '~/models/user/User'
import type { CreateUserPayload } from '~/models/users/UsersCreate'
export function useUser() {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function create(payload: CreateUserPayload): Promise<User | null> {
    loading.value = true
    error.value = null
    try {
      const user = await createUserService(payload)
      return user
    } catch (err: any) {
      error.value = err
      console.error('Erro ao criar usuário:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    create,
    loading,
    error
  }
}