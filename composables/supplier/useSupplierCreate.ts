//composables\supplier\useSupplierCreate.ts

import { ref } from 'vue'
import type { SupplierCreatePayload } from '~/models/supplier/SupplierCreate'
import { createSupplier } from '~/services/supplier/supplierService'

export const useSupplierCreate = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const errorList = ref<string[] | null>(null)

  const initial: SupplierCreatePayload = {
    person: {
      name: '',
      personType: 'individual',
      documentNumber: '',
      birthDate: null,
      status: 'active',
      email: ''
    },
    tradeName: '',
    openingDate: null,
    type: '',
    size: '',
    legalNature: '',
    contacts: [],
    addresses: []
  }

  const payload = ref<SupplierCreatePayload>({ ...initial })

  const submit = async () => {
    loading.value = true
    error.value = null
    errorList.value = null
    try {
      await createSupplier(payload.value)
      return true
    } catch (e: any) {
      error.value = e?.message || 'Falha ao criar fornecedor'
      if (Array.isArray(e?.messages)) {
        errorList.value = e.messages
      }
      return false
    } finally {
      loading.value = false
    }
  }

  return { payload, loading, error, errorList, submit }
}


