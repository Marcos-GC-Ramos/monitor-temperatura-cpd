import fetch from "node-fetch";

// URL da API (pode ser localhost se estiver rodando fora do Docker)
const API_URL = "http://localhost:3000/api/temperaturas";

console.log("🧠 Simulador de Temperatura CPD iniciado...");
console.log("📡 Enviando dados a cada 1 minuto...");

async function gerarLeitura() {
  // Gera uma temperatura aleatória entre 30°C e 70°C
  const temperatura = Number((Math.random() * 40 + 30).toFixed(2));
  const alarme = temperatura > 50; // ativa o alarme acima de 50°C

  const leitura = { temperatura, alarme };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leitura),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `🌡️ Enviado -> Temp: ${temperatura}°C | Alarme: ${alarme ? "🚨 ATIVO" : "OK"} | ID: ${
        data.id || "?"
      }`
    );
  } catch (error) {
    console.error("❌ Erro ao enviar leitura:", error.message);
  }
}

// Executa imediatamente na inicialização
await gerarLeitura();

// E repete a cada 1 minuto (60.000 ms)
setInterval(gerarLeitura, 60 * 1000);
