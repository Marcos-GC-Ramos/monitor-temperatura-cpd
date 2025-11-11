import { pool } from "../config/db.js";

export async function migrate() {
  console.log("Executando migrações");

  try {
    // Criação das tabelas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        status_acesso BOOLEAN DEFAULT TRUE,
        nivel_permissao VARCHAR(50) DEFAULT 'usuario'
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

    // Garante que as novas colunas existam mesmo em tabelas antigas
    await pool.query(`
      ALTER TABLE leituras
      ADD COLUMN IF NOT EXISTS temperatura_anterior REAL;
    `);

    await pool.query(`
      ALTER TABLE leituras
      ADD COLUMN IF NOT EXISTS temperatura_ambiente REAL;
    `);

    // Garante que as novas colunas existam em 'usuarios' também
    await pool.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS status_acesso BOOLEAN DEFAULT TRUE;
    `);

    await pool.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS nivel_permissao VARCHAR(50) DEFAULT 'usuario';
    `);

    console.log("Migrações aplicadas com sucesso!");
  } catch (error) {
    console.error("Erro ao executar migrações:", error.message);
    throw error;
  }
}
