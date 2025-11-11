import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

export async function seedAdmin() {
  console.log("Iniciando seed do usuário administrador");

  const adminEmail = "admin@cpd.com";
  const adminSenha = "admin123";
  const adminHash = await bcrypt.hash(adminSenha, 10);

  try {
    // Verifica se o admin já existe
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [adminEmail]
    );

    if (rows.length === 0) {
      // Insere com os novos campos
      await pool.query(
        `
        INSERT INTO usuarios (nome, email, senha, status_acesso, nivel_permissao)
        VALUES ($1, $2, $3, $4, $5)
        `,
        ["Administrador", adminEmail, adminHash, true, "admin"]
      );

      console.log(`Admin criado com sucesso: Email: ${adminEmail} Senha: ${adminSenha} Permissão: admin`);
    } else {
      console.log("Usuário admin já existe. Nenhuma ação necessária.");
    }
  } catch (error) {
    console.error("Erro ao criar admin:", error.message);
    throw error;
  }
}
