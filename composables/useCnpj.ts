import { ref } from 'vue'
import { fetchCnpj } from '~/services/cnpj/cnpjService'

export const useCnpj = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const lookup = async (cnpj: string): Promise<any | null> => {
    const clean = (cnpj || '').replace(/\D/g, '')
    if (!/^\d{14}$/.test(clean)) {
      error.value = 'CNPJ inválido. Deve conter 14 números.'
      return null
    }
    loading.value = true
    error.value = null
    try {
      const data = await fetchCnpj(clean)
      return data
    } catch (e: any) {
      error.value = e?.message || 'CNPJ não encontrado'
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, lookup }
}


