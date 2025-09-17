import { ref } from 'vue'
import type { SupplierCreatePayload, SupplierPerson, SupplierContact, SupplierAddress, PersonType, LinkType, ContactType } from '~/models/supplier/SupplierCreate'
import { createSupplier } from '~/services/supplier/supplierService'

export const useSupplierCreate = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

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
    try {
      await createSupplier(payload.value)
      return true
    } catch (e: any) {
      error.value = e?.message || 'Falha ao criar supplier'
      return false
    } finally {
      loading.value = false
    }
  }

  return { payload, loading, error, submit }
}


