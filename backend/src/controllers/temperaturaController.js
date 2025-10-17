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
