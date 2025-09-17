export interface Permission {
  id: number
  name: string
  description: string
}

export interface UserProfilePermission {
  profileId: number
  permissionId: number
  permission: Permission
}

export interface UserProfile {
  id: number
  name: string
  description: string
  permissions: UserProfilePermission[]
}

export interface Person {
  id: number
  name: string
  personType: string
  documentNumber: string
  birthDate: string | null
  status: string
  email: string
}

export interface UserMe {
  id: number
  person: Person
  userProfiles: UserProfile[]
}


