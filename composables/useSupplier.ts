import { ref } from 'vue'
import type { SupplierDetail } from '~/models/supplier/SupplierDetail'
import { fetchSupplierById } from '~/services/supplier/supplierService'

export const useSupplier = () => {
  const supplier = ref<SupplierDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async (id: number | string) => {
    supplier.value = null
    loading.value = true
    error.value = null
    try {
      supplier.value = await fetchSupplierById(id)
    } catch (e: any) {
      error.value = e?.message || 'Falha ao carregar supplier'
    } finally {
      loading.value = false
    }
  }

  return { supplier, loading, error, load }
}


