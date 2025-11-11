"use client";

import axios, { AxiosError } from "axios";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { obterUsuarios } from "@/services/usuarioService";
import type { Usuario } from "@/services/usuarioService";

export function useUsuarios() {
  const router = useRouter();
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
    } catch (error: unknown) {
      let mensagem = "Erro ao carregar usuários.";

      if (axios.isAxiosError(error)) {
        // é um erro do Axios
        mensagem =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao carregar usuários.";
        
        if (error.response?.status === 403) {
          toast.error(mensagem);
          
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);

          return;
        }  

      } else if (error instanceof Error) {
        // é um erro genérico do JS
        mensagem = error.message;
      }

      toast.error(mensagem);
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
