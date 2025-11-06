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

export async function enviarUsuario(
  token: string,
  nome: string,
  email: string,
  senha: string
): Promise<Usuario> {
  const { data } = await api.post(
    "/usuarios",
    { nome, email, senha },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}