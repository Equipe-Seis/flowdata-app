import { ref } from 'vue'
import { fetchCepRaw, type ViaCepResponse } from '~/services/cep/cepService'

export const useCep = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const lookup = async (cep: string): Promise<ViaCepResponse | null> => {
    const clean = (cep || '').replace(/\D/g, '')
    if (!/^\d{8}$/.test(clean)) {
      error.value = 'CEP inválido. Deve conter 8 números.'
      return null
    }
    loading.value = true
    error.value = null
    try {
      const data = await fetchCepRaw(clean)
      return data
    } catch (e: any) {
      error.value = e?.message || 'CEP não encontrado'
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, lookup }
}


