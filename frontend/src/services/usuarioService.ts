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

export async function editarUsuario(
  id: number,
  token: string,
  nome: string,
  email: string,
  nivel_permissao: string,
  senha?: string,
): Promise<Usuario> {
  const { data } = await api.put(
    `/usuarios`,
    { id, nome, email, nivel_permissao, senha},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
}

export async function atualizarStatusUsuario(
  token: string,
  id: number,
  status_acesso: boolean
) {
  const { data } = await api.put(
    `/usuarios`,
    { id, status_acesso },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
}
