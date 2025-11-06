"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "./ui/skeleton"

export interface ChartBarMultipleProps {
  loading: boolean
  data: { date: string; temperatura: number; temperatura_ambiente?: number }[]
}

const chartConfig = {
  temperatura: { label: "Temp. CPD", color: "hsl(var(--chart-1))" },
  temperatura_ambiente: { label: "Temp. Ambiente", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const fmtHora = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Manaus",
    hour12: false,
  }).format(new Date(iso))

export function ChartBarMultiple({ data, loading }: ChartBarMultipleProps) {
  const top5 = data.slice(0, 5)

  return (
    <Card className={`@container/card lg:max-h-[300px] ${loading ? "py-0" : "py-6"}`}>
      {loading ? <Skeleton className="h-[300px] w-full" /> : 
        <>
          <CardHeader>
            <CardTitle>Últimas 5 Temperaturas</CardTitle>
            <CardDescription>Temperaturas atualizadas há 1 min</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="lg:max-h-[180px] mx-auto">
              <BarChart accessibilityLayer data={top5}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={fmtHora}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                  // opcional: formatar o label do tooltip também
                  labelFormatter={fmtHora}
                />

                {/* use as vars geradas pelo ChartContainer */}
                <Bar dataKey="temperatura" fill="var(--primary)" radius={4} />
                <Bar dataKey="temperatura_ambiente" fill="var(--primary-secondary)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </>
      }
    </Card>
  )
}
