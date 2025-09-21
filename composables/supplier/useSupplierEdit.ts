import { ref } from 'vue'
import type { SupplierCreatePayload } from '~/models/supplier/SupplierCreate'
import type { SupplierDetail } from '~/models/supplier/SupplierDetail'
import { fetchSupplierById, updateSupplier } from '~/services/supplier/supplierService'

export const useSupplierEdit = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const payload = ref<SupplierCreatePayload | null>(null)
  const errorList = ref<string[] | null>(null)

  const load = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const data: SupplierDetail = await fetchSupplierById(id)
      const toBR = (iso?: string | null) => {
        if (!iso) return ''
        try {
          const d = new Date(iso)
          const dd = String(d.getUTCDate()).padStart(2, '0')
          const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
          const yyyy = d.getUTCFullYear()
          return `${dd}/${mm}/${yyyy}`
        } catch {
          const s = String(iso)
          if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
            const [y, m, d] = s.split('T')[0].split('-')
            return `${d}/${m}/${y}`
          }
          return ''
        }
      }
      payload.value = {
        person: {
          id: data.person.id,
          name: data.person.name,
          personType: data.person.personType,
          documentNumber: data.person.documentNumber,
          birthDate: toBR(data.person.birthDate) || null,
          status: data.person.status,
          email: data.person.email,
        },
        tradeName: data.tradeName || '',
        openingDate: toBR(data.openingDate) || null,
        type: data.type || '',
        size: data.size || '',
        legalNature: data.legalNature || '',
        contacts: data.contacts.map(c => ({ type: c.type as any, value: c.value, linkType: c.linkType as any, primary: c.primary, note: c.note })),
        addresses: data.addresses.map(a => ({ street: a.street, district: a.district, city: a.city, state: a.state, postalCode: a.postalCode, linkType: a.linkType as any })),
      }
    } catch (e: any) {
      error.value = e?.message || 'Falha ao carregar supplier'
    } finally {
      loading.value = false
    }
  }

  const submit = async (id: number | string) => {
    if (!payload.value) return false
    loading.value = true
    error.value = null
    errorList.value = null
    try {
      await updateSupplier(id, payload.value)
      return true
    } catch (e: any) {
      error.value = e?.message || 'Falha ao atualizar supplier'
      if (Array.isArray(e?.messages)) {
        errorList.value = e.messages
      }
      return false
    } finally {
      loading.value = false
    }
  }

  return { payload, loading, error, errorList,load, submit }
}


