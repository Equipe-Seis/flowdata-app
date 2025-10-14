import { apiFetch } from '~/composables/useApi'
import type { User as UserList, PaginatedResponse } from '~/models/users/Users' 
import type { User as UserDetail } from '~/models/users/UsersDetail'
import type { CreateUserPayload, UpdateUserPayload } from '~/models/users/UsersCreate'
export async function fetchUsers(page = 1, limit = 10): Promise<PaginatedResponse<UserList>> {
  return await apiFetch(`/users?page=${page}&limit=${limit}`)
}

export async function createUser(payload: CreateUserPayload): Promise<UserDetail> {
    return await apiFetch<UserDetail>('/users', {
        method: 'POST',
        body: payload,
    })
}

export async function fetchUserById(id: number | string): Promise<UserDetail> {
    return await apiFetch<UserDetail>(`/users/${id}`)
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<UserDetail> {
    return await apiFetch<UserDetail>(`/users/${id}`, {
      method: 'PUT',
      body: payload,
    })
}

export async function deleteUser(id: number | string) {
  return await apiFetch(`/users/${id}`, {
    method: 'DELETE',
  })
}