import { pool } from "../config/db.js";

/**
 * Cria uma nova leitura de temperatura.
 * Agora inclui temperatura anterior e ambiente.
 */
export async function criarLeitura(req, res) {
  try {
    const {
      temperatura,
      temperatura_anterior,
      temperatura_ambiente,
      alarme,
    } = req.body;

    // Validação básica
    if (temperatura === undefined || alarme === undefined) {
      return res.status(400).json({
        error: "Campos 'temperatura' e 'alarme' são obrigatórios.",
      });
    }

    const query = `
      INSERT INTO leituras (
        temperatura,
        temperatura_anterior,
        temperatura_ambiente,
        alarme
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      temperatura,
      temperatura_anterior ?? null,
      temperatura_ambiente ?? null,
      alarme,
    ];

    const resultado = await pool.query(query, values);

    return res.status(201).json({
      message: "Leitura criada com sucesso",
      leitura: resultado.rows[0],
    });
  } catch (err) {
    console.error("❌ Erro ao inserir leitura:", err.message);
    return res
      .status(500)
      .json({ error: "Erro interno ao inserir leitura." });
  }
}

/**
 * Lista todas as leituras, ordenadas por ID (mais recentes primeiro)
 */
export async function listarLeituras(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM leituras ORDER BY id DESC"
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Erro ao buscar leituras:", err.message);
    return res.status(500).json({ error: "Erro ao buscar leituras." });
  }
}

/**
 * Deleta uma leitura pelo ID.
 * Aceita id em req.body.id (preferido), ou req.params.id / req.query.id.
 */
export async function deletarLeitura(req, res) {
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
      "DELETE FROM leituras WHERE id = $1 RETURNING *;",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Leitura não encontrada." });
    }

    return res.status(200).json({
      message: "Leitura deletada com sucesso",
      leitura: rows[0],
    });
  } catch (err) {
    console.error("❌ Erro ao deletar leitura:", err.message);
    return res.status(500).json({ error: "Erro interno ao deletar leitura." });
  }
}

