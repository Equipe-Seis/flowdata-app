export enum ContactType {
  Phone = 'phone',
  Mobile = 'mobile',
  Email = 'email',
  Whatsapp = 'whatsapp',
}

export enum LinkType {
  Customer = 'customer',
  Supplier = 'supplier',
  Person = 'person',
}

export enum PersonType {
  Individual = 'individual',
  LegalEntity = 'legalentity',
}

export interface SupplierContact {
  type: ContactType
  value: string
  linkType: LinkType
  primary: boolean
  note?: string
}

export interface SupplierAddress {
  street: string
  district: string
  city: string
  state: string
  postalCode: string
  linkType: LinkType
}

export interface SupplierPerson {
  name: string
  personType: PersonType | string
  documentNumber: string
  birthDate: string | null
  status: 'active' | 'inactive' | string
  email: string
}

export interface SupplierCreatePayload {
  person: SupplierPerson
  tradeName: string
  openingDate: string | null
  type: string
  size: string
  legalNature: string
  contacts: SupplierContact[]
  addresses: SupplierAddress[]
}


