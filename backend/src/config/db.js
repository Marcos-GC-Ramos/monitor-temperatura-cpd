import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.PGUSER || "nodeuser",
  host: process.env.PGHOST || "db",
  database: process.env.PGDATABASE || "monitor_temperatura",
  password: process.env.PGPASSWORD || "123456",
  port: process.env.PGPORT || 5432,
});

export async function conectarBanco() {
  let conectado = false;
  let tentativas = 0;
  while (!conectado && tentativas < 10) {
    try {
      tentativas++;
      await pool.query("SELECT NOW()");
      conectado = true;
    } catch {
      console.log(`Tentando conectar (${tentativas})...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  if (!conectado) process.exit(1);
}
