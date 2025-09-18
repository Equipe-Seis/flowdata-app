import { useState } from 'nuxt/app'
import { ref } from 'vue'
import type { Supplier, SupplierListResponse, SupplierQuery } from '~/models/supplier/Supplier'
import { fetchSuppliers } from '~/services/supplier/supplierService'

export const useSuppliers = () => {
  const list = useState<Supplier[] | null>('suppliers:list', () => null)
  const total = useState<number>('suppliers:total', () => 0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async (query: SupplierQuery = {}) => {
    loading.value = true
    error.value = null
    try {
      const resp: SupplierListResponse = await fetchSuppliers(query)
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


