import pkg from "pg";
const { Pool } = pkg;

const isRender = !!process.env.DATABASE_URL;
let pool;

// 🌐 Ambiente Render (Neon Cloud)
if (isRender) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // ⚠️ Obrigatório para o Neon
  });
  console.log("🌐 Conectando ao banco remoto (Neon/PostgreSQL)...");
} 
// 🐋 Ambiente local (Docker)
else {
  pool = new Pool({
    user: process.env.PGUSER || "nodeuser",
    host: process.env.PGHOST || "db",
    database: process.env.PGDATABASE || "monitor_temperatura",
    password: process.env.PGPASSWORD || "123456",
    port: process.env.PGPORT || 5432,
  });
  console.log("🐘 Conectando ao banco local (PostgreSQL Docker)...");
}

// 🔁 Função de verificação de conexão
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

// 🔹 Exporta apenas o necessário
export { pool };
