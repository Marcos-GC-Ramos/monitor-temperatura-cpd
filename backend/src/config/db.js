import pkg from "pg";
const { Pool } = pkg;

// 🧩 Suporte tanto para .env local quanto DATABASE_URL (Render/Neon)
const connectionString = process.env.DATABASE_URL;

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }, // necessário pro Neon
    })
  : new Pool({
      user: process.env.PGUSER || "nodeuser",
      host: process.env.PGHOST || "db",
      database: process.env.PGDATABASE || "monitor_temperatura",
      password: process.env.PGPASSWORD || "123456",
      port: process.env.PGPORT || 5432,
    });

// 🔁 Retry de conexão (mantido do seu código original)
export async function conectarBanco() {
  let conectado = false;
  let tentativas = 0;
  while (!conectado && tentativas < 10) {
    try {
      tentativas++;
      await pool.query("SELECT NOW()");
      console.log("✅ Conectado ao PostgreSQL!");
      conectado = true;
    } catch (err) {
      console.log(`⏳ Tentando conectar (${tentativas})...`);
      console.error(err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  if (!conectado) {
    console.error("❌ Falha ao conectar ao banco de dados.");
    process.exit(1);
  }
}
