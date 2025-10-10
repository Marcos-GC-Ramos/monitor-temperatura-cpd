import fetch from "node-fetch";

// ======================== CONFIGURAÇÕES ========================
const BASE_URL = "https://monitor-temperatura-cpd.onrender.com"; // 🌐 URL da API online
// const BASE_URL = "http://localhost:3000/api/temperaturas"; // 🌐 URL da API local
const LOGIN_URL = `${BASE_URL}/api/login`;
const API_URL = `${BASE_URL}/api/temperaturas`;

// Credenciais do admin padrão
const LOGIN_CREDENCIAIS = {
  email: "admin@cpd.com",
  senha: "admin123",
};

// Intervalo entre envios (1 minuto)
const INTERVALO_MS = 60 * 1000;

// ================================================================

let token = null;
let tokenExpiraEm = null;

console.log("🧠 Simulador de Temperatura CPD iniciado...");
console.log(`📡 Enviando dados para: ${API_URL}`);
console.log("⏱️ Intervalo: a cada 1 minuto...\n");

// 🔑 Função para autenticar e obter token JWT
async function autenticar() {
  console.log("🔐 Efetuando login...");

  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(LOGIN_CREDENCIAIS),
    });

    if (!response.ok) {
      throw new Error(`Erro ao autenticar: ${response.status}`);
    }

    const data = await response.json();
    token = data.token;
    tokenExpiraEm = Date.now() + 60 * 60 * 1000; // expira em 1 hora
    console.log("✅ Login bem-sucedido! Token JWT obtido.\n");
  } catch (error) {
    console.error("❌ Falha ao autenticar:", error.message);
    token = null;
  }
}

// 🔁 Função para enviar leitura
async function enviarLeitura() {
  if (!token || Date.now() > tokenExpiraEm) {
    console.log("🔄 Token expirado ou ausente. Reautenticando...");
    await autenticar();
    if (!token) {
      console.error("🚫 Não foi possível obter token. Tentando novamente em 1 minuto.");
      return;
    }
  }

  // Gera temperatura entre 30°C e 70°C
  const temperatura = Number((Math.random() * 40 + 30).toFixed(2));
  const alarme = temperatura > 65;

  const leitura = { temperatura, alarme };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(leitura),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `🌡️ Enviado -> Temp: ${temperatura}°C | Alarme: ${
        alarme ? "ATIVADO" : "DESATIVADO"
      } | ID: ${data?.leitura?.id || "?"}`
    );
  } catch (error) {
    console.error("❌ Erro ao enviar leitura:", error.message);
  }
}

// 🚀 Execução automática
await autenticar();
await enviarLeitura();
setInterval(enviarLeitura, INTERVALO_MS);