import { ref } from 'vue'
import type { UpdateUserPayload } from '~/models/users/UsersCreate'
import type { User as UserDetail, UserProfile } from '~/models/users/UsersDetail'
import { updateUser, fetchUserById } from '~/services/users/userManagementService'

export const useUserEdit = () => {
  const payload = ref<UpdateUserPayload>({

    id: 0,
    personId: 0,
    name: '',
    email: '',
    birthDate: '',
    documentNumber: '',
    status: 'active',
    personType: 'individual',
    profiles: []
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async (id: number | string) => {
    loading.value = true
    try {
      const user = (await fetchUserById(id)) as UserDetail

      payload.value = {
        id: user.id,
        personId: Number(user.person?.id ?? 0),
        name: user.person.name,
        email: user.person.email,
        birthDate: user.person?.birthDate ? user.person.birthDate.slice(0, 10) : '',
        documentNumber: user.person.documentNumber,
        status: user.person.status,
        personType: user.person.personType,
        profiles: (user.userProfiles || []).map((p: UserProfile) => p.id)
      }
    } catch (e: any) {
      error.value = e.message || 'Erro ao carregar usuário'
    } finally {
      loading.value = false
    }
  }

  const submit = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      await updateUser(Number(id), payload.value)
      return true
    } catch (e: any) {
      error.value = e.message || 'Erro ao atualizar usuário'
      return false
    } finally {
      loading.value = false
    }
  }

  return { payload, loading, error, load, submit }
}
