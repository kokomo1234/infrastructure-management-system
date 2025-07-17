
import { ChartWrapper } from "./ChartWrapper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip
} from "recharts";
import { colors } from "./config/chartConfig";
import { progressByType, getProgressPercentages } from "./config/chartData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, BarChart3, PieChart as PieChartIcon } from "lucide-react";

export function ChartTypeTab() {
  const progressPercentages = getProgressPercentages();

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-blue-600">
            {data.value}% complété
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Progression moyenne</p>
                <p className="text-2xl font-bold text-blue-800">
                  {Math.round(progressPercentages.reduce((sum, item) => sum + item.percentage, 0) / progressPercentages.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-700">Équipements terminés</p>
                <p className="text-2xl font-bold text-emerald-800">
                  {progressPercentages.filter(item => item.percentage === 100).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Types d'équipement</p>
                <p className="text-2xl font-bold text-amber-800">
                  {progressPercentages.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-100">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-600" />
              <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Répartition par équipement
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressPercentages}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="percentage"
                  >
                    {progressPercentages.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[entry.name as keyof typeof colors]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-indigo-50/30 border-indigo-100">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Pourcentage de progression
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressPercentages} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    className="fill-gray-600"
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tickFormatter={(value) => `${value}%`}
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    className="fill-gray-600"
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.7} />
                  <Tooltip 
                    content={<CustomBarTooltip />}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="percentage" 
                    name="Pourcentage" 
                    radius={[6, 6, 0, 0]}
                    fill="url(#barGradient)"
                  >
                    {progressPercentages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[entry.name as keyof typeof colors]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ChartWrapper title="Tâches complétées vs total" className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={progressByType} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
              </linearGradient>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#D1D5DB" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              className="fill-gray-600"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              className="fill-gray-600"
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.7} />
            <Tooltip 
              content={<CustomBarTooltip />}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar 
              dataKey="completed" 
              name="Complétées" 
              stackId="a" 
              radius={[4, 4, 0, 0]}
              fill="url(#completedGradient)"
            />
            <Bar 
              dataKey="total" 
              name="Restantes" 
              stackId="a" 
              radius={[4, 4, 0, 0]} 
              fill="url(#totalGradient)"
            />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
