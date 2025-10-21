import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { criarLeitura, listarLeituras, deletarLeitura } from "../controllers/temperaturaController.js";

const router = express.Router();
router.post("/temperaturas", autenticarToken, criarLeitura);
router.get("/temperaturas", autenticarToken, listarLeituras);
router.delete("/temperaturas", autenticarToken, deletarLeitura);

export default router;
