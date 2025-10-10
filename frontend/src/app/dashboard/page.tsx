"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken, clearToken } from "@/lib/auth";
import { obterTemperaturas } from "@/services/temperaturaService";
import type { Leitura } from "@/services/temperaturaService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const router = useRouter();

  // ✅ useCallback impede que a função seja recriada a cada renderização
  const carregarLeituras = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Token ausente");

      const data = await obterTemperaturas(token);
      setLeituras(data);
      console.log("📊 Leituras carregadas:", data);
    } catch {
      toast("⚠️ Erro ao carregar temperaturas");
    }
  }, []); // sem dependências (executa só uma vez)

  function logout() {
    clearToken();
    router.push("/");
  }

  useEffect(() => {
    carregarLeituras();
    // Função opcional para recarregar a lista de temperaturas automaticamente a cada 60s
    // const interval = setInterval(carregarLeituras, 60000);
    // return () => clearInterval(interval);
  }, [carregarLeituras]);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-10 gap-6">
      <Card className="w-full max-w-3xl">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📊 Leituras de Temperatura</h2>
            <Button variant="destructive" onClick={logout}>
              🚪 Sair
            </Button>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <Button onClick={carregarLeituras}>🔄 Atualizar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 w-full max-w-2xl">
        {leituras.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex justify-between">
              <span>🌡️ {item.temperatura} °C</span>
              <span className={item.alarme ? "text-red-500" : "text-green-600"}>
                {item.alarme ? "🚨 ALARME" : "OK"}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
