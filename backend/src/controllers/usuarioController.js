// controllers/usuarios.js
import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

/**
 * Cria um novo usuário.
 * Tabela: usuarios(id, nome, email, senha)
 */
export async function criarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body || {};

    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: "Campos 'nome', 'email' e 'senha' são obrigatórios.",
      });
    }

    const senhaHash = await bcrypt.hash(String(senha), 10);

    const insert = `
      INSERT INTO usuarios (nome, email, senha)
      VALUES ($1, $2, $3)
      RETURNING id, nome, email;
    `;

    const { rows } = await pool.query(insert, [nome, email, senhaHash]);

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      usuario: rows[0], // { id, nome, email }
    });
  } catch (err) {
    if (err && err.code === "23505") {
      // requer UNIQUE(email) no banco
      return res.status(409).json({ error: "E-mail já está em uso por outro usuário." });
    }
    console.error("❌ Erro ao criar usuário:", err.message);
    return res.status(500).json({ error: "Erro interno ao criar usuário." });
  }
}

/**
 * Lista usuários com busca e paginação opcionais.
 * Query params:
 *  - page (default 1), limit (default 20)
 *  - q (busca por nome/email, opcional)
 */
export async function listarUsuarios(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const q = req.query.q?.trim();

    const where = [];
    const params = [];
    let i = 1;

    if (q) {
      where.push(`(nome ILIKE $${i} OR email ILIKE $${i})`);
      params.push(`%${q}%`);
      i++;
    }

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const dataSQL = `
      SELECT id, nome, email
        FROM usuarios
       ${whereSQL}
       ORDER BY id DESC
       LIMIT $${i} OFFSET $${i + 1};
    `;
    const countSQL = `
      SELECT COUNT(*)::int AS total
        FROM usuarios
       ${whereSQL};
    `;

    const dataParams = [...params, limit, offset];
    const [{ rows }, countResult] = await Promise.all([
      pool.query(dataSQL, dataParams),
      pool.query(countSQL, params),
    ]);

    const total = countResult.rows[0]?.total ?? 0;

    return res.status(200).json({
      total,
      page,
      limit,
      hasNextPage: offset + rows.length < total,
      data: rows, // [{ id, nome, email }]
    });
  } catch (err) {
    console.error("❌ Erro ao listar usuários:", err.message);
    return res.status(500).json({ error: "Erro interno ao listar usuários." });
  }
}

/**
 * Atualiza/edita um usuário (nome, email, senha).
 * Aceita id via body (preferido), params ou query.
 */
export async function atualizarUsuario(req, res) {
  try {
    const rawId =
      (req.body && req.body.id) ??
      (req.params && req.params.id) ??
      (req.query && req.query.id);

    if (rawId === undefined) {
      return res.status(400).json({ error: "Campo 'id' é obrigatório." });
    }

    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: "O campo 'id' deve ser um inteiro positivo." });
    }

    const { nome, email, senha } = req.body || {};

    const sets = [];
    const values = [];
    let idx = 1;

    if (nome !== undefined) {
      sets.push(`nome = $${idx++}`);
      values.push(nome);
    }
    if (email !== undefined) {
      sets.push(`email = $${idx++}`);
      values.push(email);
    }
    if (senha !== undefined) {
      const hash = await bcrypt.hash(String(senha), 10);
      sets.push(`senha = $${idx++}`);
      values.push(hash);
    }

    if (sets.length === 0) {
      return res.status(400).json({
        error: "Nenhum campo para atualizar. Envie ao menos um de: nome, email, senha.",
      });
    }

    values.push(id);
    const query = `
      UPDATE usuarios
         SET ${sets.join(", ")}
       WHERE id = $${idx}
       RETURNING id, nome, email;
    `;

    const { rows, rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json({
      message: "Usuário atualizado com sucesso",
      usuario: rows[0],
    });
  } catch (err) {
    if (err && err.code === "23505") {
      return res.status(409).json({ error: "E-mail já está em uso por outro usuário." });
    }
    console.error("❌ Erro ao atualizar usuário:", err.message);
    return res.status(500).json({ error: "Erro interno ao atualizar usuário." });
  }
}

/**
 * Deleta um usuário pelo ID.
 * Aceita id em body/params/query.
 */
export async function deletarUsuario(req, res) {
  try {
    const rawId =
      (req.body && req.body.id) ??
      (req.params && req.params.id) ??
      (req.query && req.query.id);

    if (rawId === undefined) {
      return res.status(400).json({ error: "Campo 'id' é obrigatório." });
    }

    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: "O campo 'id' deve ser um inteiro positivo." });
    }

    const { rows, rowCount } = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, email;",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json({
      message: "Usuário deletado com sucesso",
      usuario: rows[0],
    });
  } catch (err) {
    console.error("❌ Erro ao deletar usuário:", err.message);
    return res.status(500).json({ error: "Erro interno ao deletar usuário." });
  }
}
