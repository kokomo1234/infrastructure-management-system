
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { getChartConfig } from "./config/chartConfig";

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  aspectRatio?: string;
  height?: string;
}

export function ChartWrapper({
  title,
  children,
  className = "aspect-[4/3] h-80",
  aspectRatio,
  height,
}: ChartWrapperProps) {
  const chartConfig = getChartConfig();

  // Si aspectRatio et height sont fournis, on les utilise directement
  // autrement on utilise la classe par défaut
  let chartClassName = className;
  if (aspectRatio && height) {
    // On ne construit plus de template string avec "aspect-" car Tailwind ne compile pas les classes dynamiques
    // On utilise plutôt la classe appropriée directement
    chartClassName = `${height}`;
    
    // Pour l'aspect ratio, il faut utiliser une classe définie dans tailwind.config
    // Sinon, on conserve la classe par défaut
    if (aspectRatio === "4/3" || aspectRatio === "16/9" || aspectRatio === "1/1" || aspectRatio === "2/1") {
      chartClassName += ` aspect-[${aspectRatio}]`;
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={chartClassName}>
          {React.isValidElement(children) ? 
            children : 
            <>{children}</>
          }
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
