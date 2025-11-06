"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { obterTemperaturas } from "@/services/temperaturaService";
import type { Leitura } from "@/services/temperaturaService";

export function useTemperaturas() {
  const [temperaturas, setTemperaturas] = useState<Leitura[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarTemperaturas = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();

      const start = Date.now();
      const data = await obterTemperaturas(token!);

      const elapsed = Date.now() - start;
      const minDuration = 800;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      setTemperaturas(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar temperaturas");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    temperaturas,
    setTemperaturas,
    carregarTemperaturas,
    loading,
  };
}
