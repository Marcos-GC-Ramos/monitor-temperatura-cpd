import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { gerarToken } from "../middleware/auth.js";

export async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha)
    return res.status(400).json({ error: "Informe email e senha." });

  const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  if (user.rows.length === 0)
    return res.status(401).json({ error: "Usuário não encontrado." });

  const usuario = user.rows[0];

  if (usuario.status_acesso === false)
    return res.status(403).json({ error: "Acesso negado. Usuário sem permissão para acessar o sistema." });

  const valido = await bcrypt.compare(senha, usuario.senha);
  if (!valido)
    return res.status(401).json({ error: "Senha incorreta." });

  const token = gerarToken({ id: usuario.id, email: usuario.email });

  return res.json({token, email: usuario.email, nome: usuario.nome, });
}
