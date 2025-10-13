"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

// Auth & Services
import { getToken } from "@/lib/auth";
import { obterTemperaturas } from "@/services/temperaturaService";
import type { Leitura } from "@/services/temperaturaService";

// Componentes de layout e UI
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

// 📊 Tabela principal
import { DataTable } from "./data-table";

export default function Page() {
  const [leituras, setLeituras] = useState<Leitura[]>([]);

  /**
   * 📥 Carrega as leituras de temperatura da API
   * - Obtém o token
   * - Busca dados no serviço
   * - Atualiza estado local
   */
  const carregarLeituras = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Token ausente");

      const data = await obterTemperaturas(token);
      setLeituras(data);
    } catch (error) {
      toast("⚠️ Erro ao carregar temperaturas");
      console.error(error);
    }
  }, []);

  /**
   * 🔁 Efeito: carrega dados ao montar e a cada 60s
   */
  useEffect(() => {
    carregarLeituras();

    // Atualiza automaticamente a cada 60 segundos
    const interval = setInterval(carregarLeituras, 60_000);
    return () => clearInterval(interval);
  }, [carregarLeituras]);

  /**
   * 🧱 Layout da página
   */
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* Barra lateral */}
      <AppSidebar variant="inset" />

      {/* Conteúdo principal */}
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              {/* Cards de status / KPIs */}
              <SectionCards />

              {/* Gráfico de temperatura */}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>

              {/* Tabela de leituras */}
              <DataTable data={leituras} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
