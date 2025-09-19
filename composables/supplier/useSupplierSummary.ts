import { ref } from 'vue'
// @ts-ignore
import { fetchSuppliersSummary } from '~/services/supplier/supplierService'

export const useSupplierSummary = () => {
  const total = ref<number>(0)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      const summary = await fetchSuppliersSummary()
      total.value = summary.total
    } catch (err: any) {
      error.value = 'Erro ao carregar total de fornecedores'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return { total, error, loading, load }
}
