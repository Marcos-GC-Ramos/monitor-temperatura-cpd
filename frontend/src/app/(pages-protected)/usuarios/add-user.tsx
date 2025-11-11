"use client";

import { getToken } from "@/lib/auth";
import { useState } from "react";
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
import { enviarUsuario } from "@/services/usuarioService";
import { useUsuariosContext } from "@/context/UsuariosContext";

export function AddUser() {
  const { carregarUsuarios } = useUsuariosContext();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confSenha: "",
    nivel_permissao: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleNivelChange = (value: string) => { setForm({ ...form, nivel_permissao: value }); };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 🔍 Validações básicas
    if (!form.nome || !form.email || !form.senha || !form.confSenha || !form.nivel_permissao) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (form.senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (form.senha !== form.confSenha) {
      toast.error("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);

      const token = getToken(); 
      await enviarUsuario(token!, form.nome, form.email, form.senha, form.nivel_permissao, true);
      toast.success("Usuário adicionado com sucesso!");

      setForm({ nome: "", email: "", senha: "", confSenha: "", nivel_permissao: "" });
      
      await carregarUsuarios();
    } catch (err: unknown) {
      console.error(err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao adicionar usuário. Verifique os dados e tente novamente.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="default" size="sm" className="h-auto">
          Add Usuário
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form
          autoComplete="off"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <DialogHeader>
            <DialogTitle>Add usuário</DialogTitle>
            <DialogDescription>
              Adicione as informações abaixo para adicionar um novo usuário.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="nome-add">Nome</Label>
            <Input
              id="nome-add"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              autoComplete="off"
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
              autoComplete="new-email"
              type="email"
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="permissao-add">Nível de Acesso</Label>
            <Select onValueChange={handleNivelChange} value={form.nivel_permissao}>
              <SelectTrigger className="w-full" id="permissao-add">
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
              <Label htmlFor="senha-add">Senha</Label>
              <Input
                id="senha-add"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                autoComplete="new-password"
                type="password"
                placeholder="12345678"
              />
            </div>

            <div className="grid gap-3 flex-1">
              <Label htmlFor="conf-senha-add">Conf. Senha</Label>
              <Input
                id="conf-senha-add"
                name="confSenha"
                value={form.confSenha}
                onChange={handleChange}
                autoComplete="new-password"
                type="password"
                placeholder="12345678"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button variant="default" type="submit" disabled={loading}>
              {loading ? <><Spinner /><span>Adicionando...</span></> : "Add Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
