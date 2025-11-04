import api from "@/lib/api";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

export async function obterUsuarios(token: string): Promise<Usuario[]> {
  const { data } = await api.get("/usuarios", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
