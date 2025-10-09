import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.PGUSER || "nodeuser",
      host: process.env.PGHOST || "db",
      database: process.env.PGDATABASE || "monitor_temperatura",
      password: process.env.PGPASSWORD || "123456",
      port: process.env.PGPORT || 5432,
    });

async function conectarBanco() {
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

// 🔹 Exporte corretamente ambos:
export { pool, conectarBanco };
