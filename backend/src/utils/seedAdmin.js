import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

export async function seedAdmin() {
  const adminEmail = "admin@cpd.com";
  const adminSenha = "admin123";
  const adminHash = await bcrypt.hash(adminSenha, 10);

  const existe = await pool.query("SELECT * FROM usuarios WHERE email = $1", [adminEmail]);
  if (existe.rows.length === 0) {
    await pool.query("INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)", [
      "Administrador",
      adminEmail,
      adminHash,
    ]);
    console.log(`Admin criado: ${adminEmail} / ${adminSenha}`);
  }
}
