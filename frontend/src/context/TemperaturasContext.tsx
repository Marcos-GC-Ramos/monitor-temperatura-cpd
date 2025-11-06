"use client";

import { createContext, useContext } from "react";
import { useTemperaturas } from "@/hooks/use-temperaturas";

const TemperaturasContext = createContext<ReturnType<typeof useTemperaturas> | null>(null);

export function TemperaturasProvider({ children }: { children: React.ReactNode }) {
  const temperaturasHook = useTemperaturas();
  return (
    <TemperaturasContext.Provider value={temperaturasHook}>
      {children}
    </TemperaturasContext.Provider>
  );
}

export function useTemperaturasContext() {
  const context = useContext(TemperaturasContext);
  if (!context) {
    throw new Error("useTemperaturasContext deve ser usado dentro de TemperaturasProvider");
  }
  return context;
}
