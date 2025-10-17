import { pool } from "../config/db.js";

export async function migrate() {
  console.log("⚙️  Executando migrações...");

  try {
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

    console.log("🧱 Migrações aplicadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar migrações:", error.message);
    throw error;
  }
}
