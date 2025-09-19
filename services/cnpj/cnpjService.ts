export interface ReceitaWsResponse {
  status: string
  message?: string
  cnpj?: string
  nome?: string
  fantasia?: string
  email?: string
  cep?: string
  abertura?: string
  situacao?: string
  tipo?: string
  porte?: string
  natureza_juridica?: string
  logradouro?: string
  numero?: string
  complemento?: string
  municipio?: string
  bairro?: string
  uf?: string
  telefone?: string
  data_situacao?: string
}

export async function fetchCnpj(cnpjClean: string): Promise<ReceitaWsResponse> {
  const clean = cnpjClean.replace(/\D/g, '')
  if (!/^\d{14}$/.test(clean)) {
    throw new Error('CNPJ inválido. Deve conter 14 números.')
  }

  // Chama sua API proxy no backend (ajuste essa rota conforme seu backend)
  const url = `/api/cnpj/${clean}`

  const data = await $fetch<ReceitaWsResponse>(url)

  if (data.status === 'ERROR') {
    throw new Error(data.message || 'Erro na consulta do CNPJ')
  }
  return data
}
