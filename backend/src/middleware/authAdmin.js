import { pool } from "../config/db.js";

/**
 * Middleware para garantir que apenas administradores ativos acessem a rota.
 * Requer que o middleware `autenticarToken` seja executado antes.
 */
export async function authAdmin(req, res, next) {
  try {
    // Verifica se o token foi validado e se temos o usuário no req
    const usuarioToken = req.usuario;
    if (!usuarioToken || !usuarioToken.id) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    // Busca o usuário no banco para garantir que está ativo e é admin
    const { rows } = await pool.query(
      "SELECT id, nome, email, status_acesso, nivel_permissao FROM usuarios WHERE id = $1",
      [usuarioToken.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const usuario = rows[0];

    // Bloqueia se o acesso estiver desativado ou se não for admin
    if (!usuario.status_acesso) {
      return res
        .status(403)
        .json({ error: "Acesso negado. Usuário está desativado." });
    }

    if (usuario.nivel_permissao.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ error: "Acesso negado. Apenas administradores podem realizar esta ação." });
    }

    // Permite a continuação da requisição
    req.usuario = usuario; // substitui com dados atualizados do banco
    next();
  } catch (err) {
    console.error("Erro no middleware authAdmin:", err.message);
    return res.status(500).json({ error: "Erro interno ao verificar permissões." });
  }
}
