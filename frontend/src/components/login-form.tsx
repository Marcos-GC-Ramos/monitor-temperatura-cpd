"use client";

import axios, { AxiosError } from "axios";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginService } from "@/services/authService";
import { setToken } from "@/lib/auth";
import { toast } from "sonner";
import Image from "next/image"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
  const [email, setEmail] = useState("admin@cpd.com");
  const [senha, setSenha] = useState("admin123");
  const [carregando, setCarregando] = useState(false);

  // 🔑 Faz login e salva token no cookie
  async function handleLogin() {
    try {
      setCarregando(true);
      const res = await loginService(email, senha);

      // Salva no cookie via helper
      setToken(res.token, res.email, res.nome, res.nivel_permissao);
      router.push("/dashboard");
    } catch (error: unknown) {
      let mensagem = "Erro ao carregar usuários.";

      if (axios.isAxiosError(error)) {
        // é um erro do Axios
        mensagem =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao carregar usuários."; 

      } else if (error instanceof Error) {
        // é um erro genérico do JS
        mensagem = error.message;
      }

      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">VisTemp</h1>
                <p className="text-muted-foreground text-balance">
                  Entre com sua conta para continuar
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={carregando}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input 
                  id="senha" 
                  type="password" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={carregando}
                  required 
                />
              </Field>
              <Field>
                <Button 
                 onClick={handleLogin}
                  disabled={carregando}
                >{carregando ? "Entrando..." : "Entrar"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-[#eb7202] relative hidden md:block">
            <Image
              width="1200" 
              height="1200"
              src="/visteon-logo.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover scale-50"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao clicar em entrar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </FieldDescription>
    </div>
  )
}
