//composables\supplyitem\useSupplyItem.ts
import { useState } from 'nuxt/app'
import { ref } from 'vue'
import type { SupplyItem, SupplyItemListResponse, SupplyItemQuery } from '~/models/supplyitem/SupplyItem'
import { fetchSupplyItem} from '~/services/supplyitem/supplyitemService'

export const useSupplyItem = () => {
  const list = useState<SupplyItem[] | null>('supplyitem:list', () => null)
  const total = useState<number>('supplyitem:total', () => 0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async (query: SupplyItemQuery = {}) => {
    loading.value = true
    error.value = null
    try {
      const resp: SupplyItemListResponse = await fetchSupplyItem(query)
      list.value = resp.data
      total.value = resp.total
    } catch (e: any) {
      error.value = e?.message || 'Falha ao carregar fornecedores'
    } finally {
      loading.value = false
    }
  }

  return { list, total, loading, error, load }
}


