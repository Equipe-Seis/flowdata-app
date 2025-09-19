import { apiFetch } from '~/composables/useApi'
import type { User, PaginatedResponse } from '~/models/users/Users' 

export async function fetchUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
  return await apiFetch(`/users?page=${page}&limit=${limit}`)
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
    return await apiFetch<User>('/users', {
        method: 'POST',
        body: payload,
    })
}

export async function fetchUserById(id: number | string): Promise<User> {
    return await apiFetch<User>(`/users/${id}`)
}