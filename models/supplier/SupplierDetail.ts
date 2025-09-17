export interface SupplierDetailContact {
  id: number
  type: string
  value: string
  note?: string
  primary: boolean
  linkType: string
  personId: number
}

export interface SupplierDetailAddress {
  id: number
  street: string
  district: string
  city: string
  state: string
  postalCode: string
  linkType: string
  personId: number
}

export interface SupplierDetailPerson {
  id: number
  name: string
  personType: string
  documentNumber: string
  birthDate: string | null
  status: string
  email: string
}

export interface SupplierDetail {
  id: number
  person: SupplierDetailPerson
  tradeName?: string
  openingDate?: string | null
  type?: string
  size?: string
  legalNature?: string
  contacts: SupplierDetailContact[]
  addresses: SupplierDetailAddress[]
}
