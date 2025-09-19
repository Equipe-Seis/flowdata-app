// composables/useUsers.ts
import { ref } from 'vue'
import { fetchUsers } from '~/services/users/userManagementService'
import type { User } from '~/models/users/Users'

export const useUsers = () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(10)
  const loading = ref(false)

  const loadUsers = async () => {
    loading.value = true
    try {
      const response = await fetchUsers(page.value, limit.value)
      users.value = response.data
      total.value = response.total
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
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
  }
}
