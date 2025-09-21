import { apiFetch } from '~/composables/useApi'
import type { SupplyItemListResponse, SupplyItemQuery, SupplyItemCreatePayload } from '~/models/supplyitem/SupplyItem'
//import type { SupplierDetail } from '~/models/supplier/SupplierDetail'//
//import type { SupplierCreatePayload } from '~/models/supplier/SupplierCreate'

export async function fetchSupplyItem(params: SupplyItemQuery = {}): Promise<SupplyItemListResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)

  const query = searchParams.toString()
  const path = query ? `/supply?${query}` : '/supply'

 
  const response = await apiFetch<SupplyItem[]>(path)


  return {
    data: response,
    total: response.length
  }
}

export async function createSupplyItem(payload: SupplyItemCreatePayload) {
  return await apiFetch('/supply', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchSupplyItemById(id: number | string): Promise<SupplyItem> {
  return await apiFetch<SupplyItem>(`/supply/${id}`)
}

export async function updateSupplyItem(id: number | string, payload: SupplyItemCreatePayload) {
  return await apiFetch(`/supply/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

//export async function deleteSupplier(id: number | string) {
  //return await apiFetch(`/suppliers/${id}`, {
    //method: 'DELETE',
  //})
//}


