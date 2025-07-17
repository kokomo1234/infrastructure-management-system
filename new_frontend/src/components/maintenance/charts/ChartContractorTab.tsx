
import { ChartWrapper } from "./ChartWrapper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { colors } from "./config/chartConfig";
import { progressByContractor } from "./config/chartData";

export function ChartContractorTab() {
  return (
    <ChartWrapper 
      title="Répartition par entrepreneur" 
      className="aspect-auto h-96"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={progressByContractor} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <Tooltip />
          <Bar dataKey="Complété" stackId="a" fill={colors.Complété} />
          <Bar dataKey="En cours" stackId="a" fill={colors["En cours"]} />
          <Bar dataKey="Planifié" stackId="a" fill={colors.Planifié} />
          <Bar dataKey="En retard" stackId="a" fill={colors["En retard"]} />
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
