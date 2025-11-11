import api from "@/lib/api";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  nivel_permissao: string;
  status_acesso: boolean;
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
  senha: string,
  nivel_permissao: string,
  status_acesso: boolean
): Promise<Usuario> {
  const { data } = await api.post(
    "/usuarios",
    { nome, email, senha, nivel_permissao, status_acesso },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}
