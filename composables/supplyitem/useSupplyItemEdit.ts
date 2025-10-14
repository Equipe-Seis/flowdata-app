import { ref } from 'vue'
import { fetchSupplyItemById, updateSupplyItem } from '~/services/supplyitem/supplyitemService'
import type { SupplyItemCreatePayload, SupplyItem } from '~/models/supplyitem/SupplyItem'

export const useSupplyItemEdit = () => {
  const payload = ref<SupplyItemCreatePayload>({
    name: '',
    code: '',
    price: 0,
    description: ''
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async (id: number | string) => {
    loading.value = true
    try {
      const item: SupplyItem = await fetchSupplyItemById(id)
      payload.value = {
        name: item.name,
        code: item.code,
        price: item.price,
        description: item.description
      }
    } catch (e: any) {
      error.value = e.message || 'Error loading item'
    } finally {
      loading.value = false
    }
  }

  const submit = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      await updateSupplyItem(id, payload.value)
      return true
    } catch (e: any) {
      error.value = e.message || 'Error updating item'
      return false
    } finally {
      loading.value = false
    }
  }

  return { payload, loading, error, load, submit }
}
