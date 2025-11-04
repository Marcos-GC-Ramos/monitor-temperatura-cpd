"use client";

import Cookies from "js-cookie";
import { redirect } from "next/navigation"; // funciona no servidor
import { useRouter } from "next/navigation"; // funciona no client

// 🔐 Define uma função para configurar o redirecionamento seguro
function redirectToLogin() {
  // redirecionamento seguro em ambiente client
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  } else {
    redirect("/login");
  }
}

export function setToken(token: string) {
  Cookies.set("token", token, { expires: 1 / 24, secure: true });
}

export function getToken(): string | undefined {
  const token = Cookies.get("token");

  if (!token) {
    // opcional: remover cookies antigos
    Cookies.remove("token");

    // redireciona automaticamente
    redirectToLogin();
    return undefined;
  }

  return token;
}

export function clearToken() {
  Cookies.remove("token");
  redirectToLogin();
}
