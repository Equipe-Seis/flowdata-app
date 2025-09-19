export interface Person {
    id?: number
    name: string
    personType: 'individual' | 'company'
    documentNumber: string
    birthDate: string
    status: 'active' | 'inactive'
    email: string
  }
  
  export interface Permission {
    id: number
    name: string
    description: string
  }
  
  export interface ProfilePermission {
    profileId: number
    permissionId: number
    permission: Permission
  }
  
  export interface UserProfile {
    id: number
    name: string
    description: string
    permissions: ProfilePermission[]
  }
  
  export interface User {
    id: number
    person: Person
    userProfiles: UserProfile[]
  }
  