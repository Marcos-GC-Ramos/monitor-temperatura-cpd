"use client";

import { createContext, useContext } from "react";
import { useUsuarios } from "@/hooks/use-usuarios";

const UsuariosContext = createContext<ReturnType<typeof useUsuarios> | null>(null);

export function UsuariosProvider({ children }: { children: React.ReactNode }) {
  const usuariosHook = useUsuarios();
  return (
    <UsuariosContext.Provider value={usuariosHook}>
      {children}
    </UsuariosContext.Provider>
  );
}

export function useUsuariosContext() {
  const context = useContext(UsuariosContext);
  if (!context) {
    throw new Error("useUsuariosContext deve ser usado dentro de UsuariosProvider");
  }
  return context;
}
