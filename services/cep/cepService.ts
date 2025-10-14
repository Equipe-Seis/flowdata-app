export interface ViaCepResponse {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  ibge?: string
  gia?: string
  ddd?: string
  siafi?: string
  erro?: boolean
}

export async function fetchCepRaw(cleanCep: string): Promise<ViaCepResponse> {
  const url = `https://viacep.com.br/ws/${cleanCep}/json/`
  const data = await $fetch<ViaCepResponse>(url)
  if ((data as any)?.erro) {
    throw new Error('CEP não encontrado')
  }
  return data
}


