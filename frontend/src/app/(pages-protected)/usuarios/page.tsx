"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

// Auth & Services
import { getToken } from "@/lib/auth";
import { obterUsuarios } from "@/services/usuarioService";
import type { Usuario } from "@/services/usuarioService";

// 📊 Tabela principal
import { DataTable } from "./data-table";

export default function Page() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const carregarUsuarios = useCallback(async () => {
    try {
      const token = getToken(); 
      const data = await obterUsuarios(token!);
      setUsuarios(data);

    } catch (error) {
      toast("⚠️ Erro ao carregar usuarios");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={usuarios} />
        </div>
      </div>
    </div>
  );
}
