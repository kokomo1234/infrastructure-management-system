
import { ChartWrapper } from "./ChartWrapper";
import { StatusPieChart } from "./StatusPieChart";
import { StatusTrendChart } from "./StatusTrendChart";

export function ChartStatusTab() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <ChartWrapper title="Répartition par statut">
        <StatusPieChart />
      </ChartWrapper>
      
      <ChartWrapper title="Tendances de complétion">
        <StatusTrendChart />
      </ChartWrapper>
    </div>
  );
}
