"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { obterUsuarios } from "@/services/usuarioService";
import type { Usuario } from "@/services/usuarioService";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();

      const start = Date.now();
      const data = await obterUsuarios(token!);

      const elapsed = Date.now() - start;
      const minDuration = 800;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      setUsuarios(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  return {
    usuarios,
    setUsuarios,
    carregarUsuarios,
    loading,
    initialized,
  };
}
