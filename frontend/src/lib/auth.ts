import Cookies from "js-cookie";

export function setToken(token: string) {
  Cookies.set("token", token, { expires: 1 / 24, secure: true });
}

export function getToken(): string | undefined {
  return Cookies.get("token");
}

export function clearToken() {
  Cookies.remove("token");
}
