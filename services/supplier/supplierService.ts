import { apiFetch } from '~/composables/useApi'
import type { SupplierListResponse, SupplierQuery } from '~/models/supplier/Supplier'

export async function fetchSuppliers(params: SupplierQuery = {}): Promise<SupplierListResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)

  const query = searchParams.toString()
  const path = query ? `/suppliers?${query}` : '/suppliers'
  return await apiFetch<SupplierListResponse>(path)
}


