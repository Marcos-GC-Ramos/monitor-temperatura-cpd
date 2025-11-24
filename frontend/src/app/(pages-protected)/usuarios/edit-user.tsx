"use client";

import { getToken } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"
import { editarUsuario } from "@/services/usuarioService";
import { useUsuariosContext } from "@/context/UsuariosContext";

interface UsuarioProps {
  id?: number;
  nome?: string;
  email?: string;
  nivel_permissao?: string;
}

export function EditUser({ usuario }: { usuario?: UsuarioProps }) {
    const { carregarUsuarios } = useUsuariosContext();

    const [form, setForm] = useState({
        id: 0,
        nome: "",
        email: "",
        senha: "",
        confSenha: "",
        nivel_permissao: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (usuario) {
        setForm((prev) => ({
            ...prev,
            id: usuario.id ?? 0,
            nome: usuario.nome ?? "",
            email: usuario.email ?? "",
            nivel_permissao: usuario.nivel_permissao ?? "",
            senha: "",
            confSenha: "",
        }));
        }
    }, [usuario]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setForm({ ...form, [e.target.name]: e.target.value }); };
  const handleNivelChange = (value: string) => { setForm({ ...form, nivel_permissao: value }); };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 🔍 Validações básicas
    if (!form.nome || !form.email || !form.nivel_permissao) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    // Se o usuário digitou uma nova senha, validar
    if (form.senha || form.confSenha) {
        if (form.senha.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
        return;
        }

        if (form.senha !== form.confSenha) {
        toast.error("As senhas não conferem.");
        return;
        }
    }

    try {
        setLoading(true);

        const token = getToken(); 

        await editarUsuario(
            form.id,
            token!,
            form.nome,
            form.email,
            form.nivel_permissao,
            form.senha || undefined, 
        );

        toast.success("Dados do usuário atualizados com sucesso!");
      
        await carregarUsuarios();
    } catch (err: unknown) {
      console.error(err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao salvar usuário. Verifique os dados e tente novamente.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="default" size="sm" className="w-full ">
          {usuario ? "Editar Usuário" : "Adicionar Usuário"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form autoComplete="off" className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{usuario ? "Editar usuário" : "Adicionar novo usuário"}</DialogTitle>
            <DialogDescription>
              {usuario
                ? "Atualize as informações abaixo."
                : "Adicione as informações abaixo para adicionar um novo usuário."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="nome-add">Nome</Label>
            <Input
              id="nome-add"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              type="text"
              placeholder="Primeiro e último nome"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email-add">E-mail</Label>
            <Input
              id="email-add"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="permissao-add">Nível de Acesso</Label>
            <Select onValueChange={handleNivelChange} value={form.nivel_permissao}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma permissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Nível de Acesso</SelectLabel>
                  <SelectItem value="usuario">Usuário base</SelectItem>
                  <SelectItem value="admin">Usuário Administrador</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <div className="grid gap-3 flex-1">
              <Label>Senha</Label>
              <Input
                name="senha"
                value={form.senha}
                onChange={handleChange}
                type="password"
                placeholder="Nova senha"
              />
            </div>

            <div className="grid gap-3 flex-1">
              <Label>Conf. Senha</Label>
              <Input
                name="confSenha"
                value={form.confSenha}
                onChange={handleChange}
                type="password"
                placeholder="Confirmar senha"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  <span>Salvando...</span>
                </>
              ) : usuario ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
