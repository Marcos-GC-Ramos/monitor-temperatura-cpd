import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

export const pool = connectionString
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
