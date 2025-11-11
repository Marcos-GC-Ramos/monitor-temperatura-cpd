import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { authStatusAcesso } from "../middleware/authStatusAcesso.js";
import { criarUsuario, listarUsuarios, deletarUsuario, atualizarUsuario } from "../controllers/usuarioController.js";

const router = express.Router();
router.post("/usuarios", autenticarToken, authStatusAcesso, authAdmin, criarUsuario);
router.get("/usuarios", autenticarToken, authStatusAcesso, authAdmin, listarUsuarios);
router.delete("/usuarios", autenticarToken, authStatusAcesso, authAdmin, deletarUsuario);
router.put("/usuarios", autenticarToken, authStatusAcesso, authAdmin, atualizarUsuario);

export default router;
