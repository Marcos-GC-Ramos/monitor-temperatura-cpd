"use client";

import { DataTable } from "./data-table";
import { UsuariosProvider, useUsuariosContext } from "@/context/UsuariosContext";
import { useEffect } from "react";

function UsuariosPageContent() {
  const { usuarios, loading, initialized, carregarUsuarios } = useUsuariosContext();

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={usuarios} loading={loading} initialized={initialized} />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <UsuariosProvider>
      <UsuariosPageContent />
    </UsuariosProvider>
  );
}
