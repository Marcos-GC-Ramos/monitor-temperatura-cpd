"use client";

import { useEffect } from "react";
import { TemperaturasProvider, useTemperaturasContext } from "@/context/TemperaturasContext";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "./data-table";

function TemperaturasPageContent() {
  const { temperaturas, loading, carregarTemperaturas } = useTemperaturasContext();

  useEffect(() => {
    carregarTemperaturas();

    const interval = setInterval(carregarTemperaturas, 60_000);
    return () => clearInterval(interval);
  }, [carregarTemperaturas]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionCards 
            data={temperaturas.map((item) => ({
              date: item.data,
              temperatura: item.temperatura,
              temperatura_ambiente: item.temperatura_ambiente,
            }))}
          />

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive
              data={temperaturas.map((item) => ({
                date: item.data,
                temperatura: item.temperatura,
                temperatura_ambiente: item.temperatura_ambiente,
              }))}
            />
          </div>

          <DataTable data={temperaturas} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <TemperaturasProvider>
      <TemperaturasPageContent />
    </TemperaturasProvider>
  );
}
