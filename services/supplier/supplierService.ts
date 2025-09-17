import { apiFetch } from '~/composables/useApi'
import type { SupplierListResponse, SupplierQuery } from '~/models/supplier/Supplier'
import type { SupplierCreatePayload } from '~/models/supplier/SupplierCreate'

export async function fetchSuppliers(params: SupplierQuery = {}): Promise<SupplierListResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)

  const query = searchParams.toString()
  const path = query ? `/suppliers?${query}` : '/suppliers'
  return await apiFetch<SupplierListResponse>(path)
}

export async function createSupplier(payload: SupplierCreatePayload) {
  return await apiFetch('/suppliers', {
    method: 'POST',
    body: payload,
  })
}


