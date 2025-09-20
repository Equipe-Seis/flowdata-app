// composables/useUsers.ts
import { ref } from 'vue'
import { fetchUsers } from '~/services/users/userManagementService'
import type { User } from '~/models/users/Users'
import { deleteUser } from '~/services/users/userManagementService'

export const useUsers = () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(10)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadUsers = async () => {
    loading.value = true
    try {
      const response = await fetchUsers(page.value, limit.value)
      users.value = response.data
      total.value = response.total
    } catch (error) {
      //console.error('Erro ao carregar usuários:', error)
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: number | string): Promise<boolean> => {
    loading.value = true
    error.value = null
    try {
      await deleteUser(id)
      return true
    } catch (e: any) {
      error.value = e.message || 'Error deleting user'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    total,
    page,
    limit,
    loading,
    loadUsers,
    remove
  }
}

