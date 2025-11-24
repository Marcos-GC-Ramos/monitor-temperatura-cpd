"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { atualizarStatusUsuario } from "@/services/usuarioService";
import { getToken } from "@/lib/auth";
import { toast } from "sonner";
import { useUsuariosContext } from "@/context/UsuariosContext";

interface ToggleStatusUserProps {
  iduser: number;
  statusAtual: boolean;
}

export function ToggleStatusUser({ iduser, statusAtual }: ToggleStatusUserProps) {
  const [status, setStatus] = useState(statusAtual);
  const token = getToken();
  const { carregarUsuarios } = useUsuariosContext();

  async function handleChange(checked: boolean) {
    setStatus(checked);

    try {
      await atualizarStatusUsuario(token!, iduser, checked);
      toast.success("Status atualizado!");
      await carregarUsuarios();
    } catch (err) {
      toast.error("Erro ao atualizar status.");
      setStatus(!checked);
    }
  }

  return (
    <div className="flex items-center space-x-2 my-1">
      <Switch
        id={`status-${iduser}`}
        checked={status}
        onCheckedChange={handleChange}
      />
      <Label htmlFor={`status-${iduser}`}>
        {status ? "Acesso Ativo" : "Acesso Inativo"}
      </Label>
    </div>
  );
}
