"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Temperatura - Últimas horas"

export interface ChartAreaInteractiveProps {
  data: {
    date: string
    temperatura: number
    temperatura_ambiente: number | null
  }[]
}

const chartConfig = {
  temperatura: {
    label: "Temp. CPD",
    color: "var(--primary)",
  },
  temperatura_ambiente: {
    label: "Temp. Ambiente",
    color: "var(--primary-secondary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("24h")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("3h")
    }
  }, [isMobile])

  //
  // 🔹 Ordena os dados por data/hora (garantindo ordem crescente)
  //
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [data])

  //
  // 🔹 Filtra conforme última(s) hora(s)
  //
  const filteredData = React.useMemo(() => {
    if (!sortedData.length) return []

    const now = new Date(sortedData[sortedData.length - 1].date) // usa o último dado como referência
    let hoursToSubtract = 24

    if (timeRange === "12h") hoursToSubtract = 12
    if (timeRange === "3h") hoursToSubtract = 3

    const startDate = new Date(now)
    startDate.setHours(now.getHours() - hoursToSubtract)

    return sortedData.filter((item) => new Date(item.date) >= startDate)
  }, [sortedData, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Temperatura (últimas horas)</CardTitle>
        <CardDescription>
          Leituras das últimas {timeRange.replace("h", " horas")}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="3h">Últ. 3h</ToggleGroupItem>
            <ToggleGroupItem value="12h">Últ. 12h</ToggleGroupItem>
            <ToggleGroupItem value="24h">Últ. 24h</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
            >
              <SelectValue placeholder="Últimas horas" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="3h">Últ. 3h</SelectItem>
              <SelectItem value="12h">Últ. 12h</SelectItem>
              <SelectItem value="24h">Últ. 24h</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTemperatura" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTemperaturaAmbiente" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-secondary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary-secondary)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              tickFormatter={(value) => {
                const d = new Date(value)
                return d.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const d = new Date(value)
                    return d.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="temperatura_ambiente"
              type="monotone"
              fill="url(#fillTemperaturaAmbiente)"
              stroke="var(--primary-secondary)"
              stackId="a"
            />
            <Area
              dataKey="temperatura"
              type="monotone"
              fill="url(#fillTemperatura)"
              stroke="var(--primary)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
