import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { authStatusAcesso } from "../middleware/authStatusAcesso.js";
import { criarLeitura, listarLeituras, deletarLeitura } from "../controllers/temperaturaController.js";

const router = express.Router();
router.post("/temperaturas", autenticarToken, authStatusAcesso, criarLeitura);
router.get("/temperaturas", autenticarToken, authStatusAcesso, listarLeituras);
router.delete("/temperaturas", autenticarToken, authStatusAcesso, deletarLeitura);

export default router;
