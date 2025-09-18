import { ref } from 'vue'
import type { SupplyItemCreatePayload } from '~/models/supplyitem/SupplyItem'
import { createSupplyItem } from '~/services/supplyitem/supplyitemService'

export const useSupplyItemCreate = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const payload = ref<SupplyItemCreatePayload>({ name: '', code: '', price: 0, description: '' })

  const submit = async () => {
    loading.value = true
    error.value = null
    try {
      await createSupplyItem(payload.value)
      return true
    } catch (e: any) {
      error.value = e?.message || 'Falha ao criar supply item'
      return false
    } finally {
      loading.value = false
    }
  }

  return { payload, loading, error, submit }
}



