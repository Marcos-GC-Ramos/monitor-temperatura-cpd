import { ChartRadialStacked } from "@/components/chart-radial-stacked";
import { useTemperaturasContext } from "@/context/TemperaturasContext";
import { ChartBarMultiple } from "./chart-bar-multiple";

export interface SectionCardsProps {
  data: {
    date: string
    temperatura: number
    temperatura_ambiente: number | null
  }[]
}

export function SectionCards({ data }: SectionCardsProps) {  
  const { loading } = useTemperaturasContext();

  return (
    <div className="
          *:data-[slot=card]:from-primary/5 
          *:data-[slot=card]:to-card 
          dark:*:data-[slot=card]:bg-card 
          grid grid-cols-1 gap-4 px-4 
          *:data-[slot=card]:bg-gradient-to-t 
          *:data-[slot=card]:shadow-xs lg:px-6 lg:grid-cols-3">

      <ChartRadialStacked
        loading={loading}
        title="Temperatura CPD"
        bgChart="var(--primary)"
        data={data.map((item) => ({
          temperatura: item.temperatura,
        }))}
      />

      <ChartRadialStacked
        loading={loading}
        title="Temperatura Ambiente" 
        bgChart="var(--primary-secondary)"
        data={data.map((item) => ({
          temperatura: item.temperatura_ambiente ?? 0,
        }))}
      />

      <ChartBarMultiple
        loading={loading}
        data={data.map((item) => ({
            date: item.date,
            temperatura: item.temperatura,
            temperatura_ambiente: item.temperatura_ambiente ?? 0,
        }))}
      />
    </div>
  )
}
