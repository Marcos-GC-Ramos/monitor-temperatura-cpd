import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo-super-seguro";

export function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token ausente." });

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ error: "Token inválido." });
    req.usuario = usuario;
    next();
  });
}

export function gerarToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}
