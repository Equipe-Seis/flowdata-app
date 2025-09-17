export interface Supplier {
  id: number
  name: string
  email: string
  documentNumber: string
  status: 'active' | 'inactive' | string
  tradeName: string
}

export interface SupplierListResponse {
  data: Supplier[]
  total: number
}

export interface SupplierQuery {
  page?: number
  pageSize?: number
  search?: string
  status?: string
}


