import api from "@/lib/api";

export interface Leitura {
  id: number;
  temperatura: number;
  data: string;
  alarme: boolean;
}

export async function obterTemperaturas(token: string): Promise<Leitura[]> {
  const { data } = await api.get("/temperaturas", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function enviarTemperatura(
  token: string,
  temperatura: number,
  alarme: boolean
): Promise<Leitura> {
  const { data } = await api.post(
    "/temperaturas",
    { temperatura, alarme },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}
