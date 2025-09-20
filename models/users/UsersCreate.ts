export interface CreateUserPayload {
    person: {
      name: string
      personType: 'individual' | 'company'
      documentNumber: string
      birthDate: string
      status: 'active' | 'inactive'
      email: string
    }
    password: string
    profiles: number[] 
  }


  export interface UpdateUserPayload {
    id: number
    personId: number
    name: string
    personType: 'individual' | 'company'
    documentNumber: string
    birthDate: string
    status: 'active' | 'inactive'
    email: string
    profiles: number[]
  }