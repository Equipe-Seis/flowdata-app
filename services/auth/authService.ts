import axios from 'axios';

export function createApi(baseURL: string) {
  return axios.create({ baseURL });
}

export async function loginRequest(baseURL: string, email: string, password: string) {
  const api = createApi(baseURL);

  try {
    const response = await api.post('/auth/signin', { email, password });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return null;
  }
}

export async function refreshTokenRequest(baseURL: string, refresh_token: string) {
  const api = createApi(baseURL);

  try {
    const response = await api.post('/refresh', { refresh_token });
    return response.data;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return null;
  }
}
