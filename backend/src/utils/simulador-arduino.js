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

const INTERVALO_MS = 60 * 1000; 

const LIMITE = 65; // temperatura limite para alarme
const LAT = -3.1190; // Manaus (ajuste se quiser outra cidade)
const LON = -60.0217;

// ================================================================

let token = null;
let tokenExpiraEm = null;
let ultimaTemperatura = null;

console.log("🧠 Simulador de Temperatura CPD iniciado...");
console.log(`📡 Enviando dados para: ${API_URL}`);
console.log("🌦️ Consultando temperatura ambiente via Open-Meteo");
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

// 🌤️ Função para buscar temperatura ambiente da Open-Meteo
async function obterTemperaturaAmbiente() {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`
    );
    const data = await res.json();
    return Number(data.current_weather?.temperature ?? null);
  } catch (error) {
    console.error("⚠️ Erro ao obter temperatura ambiente:", error.message);
    return null;
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
  const temperatura_anterior = ultimaTemperatura ?? temperatura;
  const alarme = temperatura > LIMITE;

  // Busca temperatura ambiente
  const temperatura_ambiente = await obterTemperaturaAmbiente();

  // Monta objeto de leitura
  const leitura = {
    temperatura,
    temperatura_anterior,
    temperatura_ambiente,
    alarme,
  };

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
      `🌡️ Enviado -> Atual: ${temperatura}°C | Anterior: ${temperatura_anterior}°C | Ambiente: ${temperatura_ambiente}°C | ` +
      `Alarme: ${alarme ? "🚨 ATIVADO" : "✅ Desativado"} | ID: ${data?.leitura?.id || "?"}`
    );

    // Atualiza última leitura
    ultimaTemperatura = temperatura;
  } catch (error) {
    console.error("❌ Erro ao enviar leitura:", error.message);
  }
}

// 🚀 Execução automática
await autenticar();
await enviarLeitura();
setInterval(enviarLeitura, INTERVALO_MS);