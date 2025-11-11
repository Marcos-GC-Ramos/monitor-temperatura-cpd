// middleware/authStatusAcesso.js
import { pool } from "../config/db.js";

/**
 * Middleware que permite apenas usuários com `status_acesso = true`.
 * Deve ser usada depois de `autenticarToken`.
 */
export async function authStatusAcesso(req, res, next) {
  try {
    // Verifica se o token já foi autenticado
    const usuarioToken = req.usuario;
    if (!usuarioToken || !usuarioToken.id) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    // Busca o usuário no banco para garantir status atualizado
    const { rows } = await pool.query(
      "SELECT id, nome, email, status_acesso, nivel_permissao FROM usuarios WHERE id = $1",
      [usuarioToken.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const usuario = rows[0];

    // 🚫 Bloqueia se o acesso estiver desativado
    if (!usuario.status_acesso) {
      return res.status(403).json({
        error: "Acesso negado. Usuário desativado ou sem permissão de acesso.",
      });
    }

    // ✅ Permite a continuação da requisição
    req.usuario = usuario; // substitui com dados atualizados do banco
    next();
  } catch (err) {
    console.error("Erro no middleware authStatusAcesso:", err.message);
    return res.status(500).json({ error: "Erro interno ao verificar acesso do usuário." });
  }
}
