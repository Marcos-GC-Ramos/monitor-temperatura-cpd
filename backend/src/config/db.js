import pkg from "pg";
const { Pool } = pkg;

// Detecta se está no ambiente de produção (Render)
const isProduction = process.env.NODE_ENV === "production";

// Prioriza DATABASE_URL (usado no Render + Neon)
let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Obrigatório pro Neon
  });
  console.log("🌐 Usando conexão externa (Neon/PostgreSQL remoto)");
} else {
  // Fallback: conexão local via Docker Compose
  pool = new Pool({
    user: process.env.PGUSER || "nodeuser",
    host: process.env.PGHOST || "db",
    database: process.env.PGDATABASE || "monitor_temperatura",
    password: process.env.PGPASSWORD || "123456",
    port: process.env.PGPORT || 5432,
  });
  console.log("🐘 Usando conexão local (Postgres Docker)");
}

export async function conectarBanco() {
  let conectado = false;
  let tentativas = 0;
  while (!conectado && tentativas < 10) {
    try {
      tentativas++;
      await pool.query("SELECT NOW()");
      conectado = true;
      console.log("✅ Conectado ao PostgreSQL!");
    } catch (err) {
      console.log(`⏳ Tentando conectar (${tentativas})...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  if (!conectado) {
    console.error("❌ Falha ao conectar ao banco de dados.");
    process.exit(1);
  }
}

export { pool };
