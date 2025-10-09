import { pool } from "../config/db.js";

export async function criarLeitura(req, res) {
  try {
    const { temperatura, alarme } = req.body;
    if (temperatura === undefined || alarme === undefined)
      return res.status(400).json({ error: "Campos 'temperatura' e 'alarme' são obrigatórios." });

    const resultado = await pool.query(
      "INSERT INTO leituras (temperatura, alarme) VALUES ($1, $2) RETURNING *",
      [temperatura, alarme]
    );

    return res.status(201).json({
      message: "Leitura criada com sucesso",
      leitura: resultado.rows[0],
    });
  } catch (err) {
    console.error("Erro ao inserir leitura:", err.message);
    return res.status(500).json({ error: "Erro interno ao inserir leitura." });
  }
}

export async function listarLeituras(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM leituras ORDER BY id DESC LIMIT 20");
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar leituras:", err.message);
    return res.status(500).json({ error: "Erro ao buscar leituras." });
  }
}
