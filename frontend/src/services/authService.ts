import api from "@/lib/api";

export interface LoginResponse {
  token: string;
  nome: string;
  email: string;
  nivel_permissao: string;
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const { data } = await api.post("/login", { email, senha });
  return data;
}
