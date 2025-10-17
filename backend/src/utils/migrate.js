import { pool } from "../config/db.js";

export async function migrate() {
  console.log("⚙️ Executando migrações...");

  try {
    // Criação das tabelas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS leituras (
        id SERIAL PRIMARY KEY,
        temperatura REAL NOT NULL,
        temperatura_anterior REAL,
        temperatura_ambiente REAL,
        data TIMESTAMP DEFAULT NOW(),
        alarme BOOLEAN
      );
    `);

    // 🔧 Garante que as novas colunas existam mesmo em tabelas antigas
    await pool.query(`
      ALTER TABLE leituras
      ADD COLUMN IF NOT EXISTS temperatura_anterior REAL;
    `);

    await pool.query(`
      ALTER TABLE leituras
      ADD COLUMN IF NOT EXISTS temperatura_ambiente REAL;
    `);

    console.log("🧱 Migrações aplicadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar migrações:", error.message);
    throw error;
  }
}
