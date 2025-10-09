import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { gerarToken } from "../middleware/auth.js";

export async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: "Informe email e senha." });

  const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  if (user.rows.length === 0) return res.status(401).json({ error: "Usuário não encontrado." });

  const valido = await bcrypt.compare(senha, user.rows[0].senha);
  if (!valido) return res.status(401).json({ error: "Senha incorreta." });

  const token = gerarToken({ id: user.rows[0].id, email: user.rows[0].email });
  return res.json({ token });
}
