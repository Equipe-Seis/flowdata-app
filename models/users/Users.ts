export interface User {
    id: number
    name: string
    email: string
}
  
export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

