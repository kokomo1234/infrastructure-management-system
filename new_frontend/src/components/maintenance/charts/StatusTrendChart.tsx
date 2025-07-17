
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { colors } from "./config/chartConfig";
import { statusTrendData } from "./config/chartData";

export function StatusTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={statusTrendData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="Complété" stackId="1" stroke={colors["Complété"]} fill={colors["Complété"]} />
        <Area type="monotone" dataKey="En cours" stackId="1" stroke={colors["En cours"]} fill={colors["En cours"]} />
        <Area type="monotone" dataKey="Planifié" stackId="1" stroke={colors["Planifié"]} fill={colors["Planifié"]} />
        <Area type="monotone" dataKey="En retard" stackId="1" stroke={colors["En retard"]} fill={colors["En retard"]} />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
}
