"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

// Auth & Services
import { getToken } from "@/lib/auth";
import { obterTemperaturas } from "@/services/temperaturaService";
import type { Leitura } from "@/services/temperaturaService";

// Componentes de layout e UI
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

// 📊 Tabela principal
import { DataTable } from "./data-table";

export default function Page() {
  const [leituras, setLeituras] = useState<Leitura[]>([]);

  const carregarLeituras = useCallback(async () => {
    try {
      const token = getToken(); 
      const data = await obterTemperaturas(token!);
      setLeituras(data);

    } catch (error) {
      toast("⚠️ Erro ao carregar temperaturas");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    carregarLeituras();

    // Atualiza automaticamente a cada 60 segundos
    const interval = setInterval(carregarLeituras, 60_000);
    return () => clearInterval(interval);
  }, [carregarLeituras]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards 
            data={leituras.map((item) => ({
              date: item.data,
              temperatura: item.temperatura,
              temperatura_ambiente: item.temperatura_ambiente,
            }))}
          />

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive
              data={leituras.map((item) => ({
                date: item.data,
                temperatura: item.temperatura,
                temperatura_ambiente: item.temperatura_ambiente,
              }))}
            />
          </div>

          <DataTable data={leituras} />
        </div>
      </div>
    </div>
  );
}
