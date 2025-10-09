import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDoc } from "./config/swagger.js";
import { pool, conectarBanco } from "./config/db.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import loginRoutes from "./routes/login.routes.js";
import temperaturaRoutes from "./routes/temperatura.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/api", loginRoutes);
app.use("/api", temperaturaRoutes);

// Swagger
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, { swaggerOptions: { persistAuthorization: true } })
);

// Inicialização
await conectarBanco();

// 🔹 Cria tabelas se não existirem
await pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS leituras (
    id SERIAL PRIMARY KEY,
    temperatura REAL,
    data TIMESTAMP DEFAULT NOW(),
    alarme BOOLEAN
  );
`);

await seedAdmin();