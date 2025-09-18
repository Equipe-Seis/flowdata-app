export interface SupplyItem {
  id: number
  name: string
  code: string
  price: number
  description: string
}

export interface SupplyItemCreatePayload {
  name: string
  code: string
  price: number
  description: string
}

export interface SupplyItemListResponse {
  data: SupplyItem[]
  total: number
}

export interface SupplyItemQuery {
  page?: number
  limit?: number
  search?: string
  status?: string
}

