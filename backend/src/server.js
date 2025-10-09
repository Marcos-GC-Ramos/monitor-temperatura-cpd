import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDoc } from "./config/swagger.js";
import { conectarBanco } from "./config/db.js";
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
await seedAdmin();

app.listen(3000, () => {
  console.log("Swagger: http://localhost:3000/docs");
});
