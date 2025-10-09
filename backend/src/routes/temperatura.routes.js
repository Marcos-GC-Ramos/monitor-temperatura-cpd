import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { criarLeitura, listarLeituras } from "../controllers/temperaturaController.js";

const router = express.Router();
router.post("/temperaturas", autenticarToken, criarLeitura);
router.get("/temperaturas", autenticarToken, listarLeituras);

export default router;
