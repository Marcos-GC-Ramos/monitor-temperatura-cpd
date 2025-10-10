"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginService } from "@/services/authService";
import { setToken } from "@/lib/auth";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Home() {
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
      setToken(res.token);

      toast.success("✅ Login efetuado com sucesso!");
      router.push("/dashboard");
    } catch {
      toast.error("Falha no login. Verifique suas credenciais.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="space-y-4 pt-6">
          <h1 className="text-2xl font-bold text-center">
            🌡️ Login - Monitor CPD
          </h1>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div>
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={carregando}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
