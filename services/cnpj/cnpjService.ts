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
  const url = `/cnpj/${cnpjClean}`;
  try {
    return await apiFetch<ReceitaWsResponse>(url, { method: 'GET' });
  } catch (error) {
    console.error('Erro ao buscar dados do CNPJ:', error);
    throw error;
  }
}
