import { ref, computed, onMounted } from 'vue'
import type { UserMe } from '../models/user/User'
import { fetchCurrentUser } from '../services/user/userService'

const user = ref<UserMe | null>(null)
const loaded = ref(false)

export function useUserInfo() {
  if (!loaded.value) {
    onMounted(async () => {
      try {
        user.value = await fetchCurrentUser()
      } catch (e) {
        user.value = null
      } finally {
        loaded.value = true
      }
    })
  }

  const primaryProfile = computed(() => user.value?.userProfiles?.[0]?.name || '-')

  const roleLabel = computed(() => {
    return primaryProfile.value === '-' ? 'Desconhecido' : primaryProfile.value
  })

  return {
    user,
    primaryProfile,
    roleLabel
  }
}