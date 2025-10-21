import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { criarUsuario, listarUsuarios, deletarUsuario, atualizarUsuario } from "../controllers/usuarioController.js";

const router = express.Router();
router.post("/usuarios", autenticarToken, criarUsuario);
router.get("/usuarios", autenticarToken, listarUsuarios);
router.delete("/usuarios", autenticarToken, deletarUsuario);
router.put("/usuarios", autenticarToken, atualizarUsuario);

export default router;
