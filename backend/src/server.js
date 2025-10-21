import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDoc } from "./config/swagger.js";
import { conectarBanco } from "./config/db.js";
import { migrate } from "./utils/migrate.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import loginRoutes from "./routes/login.routes.js";
import temperaturaRoutes from "./routes/temperatura.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/api", loginRoutes);
app.use("/api", temperaturaRoutes);
app.use("/api", usuarioRoutes);

// Swagger
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, { swaggerOptions: { persistAuthorization: true } })
);

async function startServer() {
  try {
    // Conectar ao banco
    await conectarBanco();

    // Criar tabelas se não existirem
    await migrate();

    // Inserir admin padrão, se necessário
    await seedAdmin();

    // 🧩 Porta dinâmica (Render usa variável PORT)
    const PORT = process.env.PORT || 3000;
    const BASE_URL =
      process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

    app.listen(PORT, () => {
      console.log("==============================================");
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📘 Swagger: ${BASE_URL}/docs`);
      console.log("==============================================");
    });
  } catch (err) {
    console.error("❌ Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

// Inicializa tudo
startServer();