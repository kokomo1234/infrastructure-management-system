
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterControls } from "./charts/FilterControls";
import { ChartTypeTab } from "./charts/ChartTypeTab";
import { ChartStatusTab } from "./charts/ChartStatusTab";
import { ChartContractorTab } from "./charts/ChartContractorTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, Users, TrendingUp } from "lucide-react";

export function MaintenanceProgressCharts() {
  const [yearFilter, setYearFilter] = useState("2025");
  const [periodFilter, setPeriodFilter] = useState("year");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Analytics de maintenance
            </h2>
            <p className="text-muted-foreground">Analyse détaillée des performances</p>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-100">
        <CardHeader>
          <FilterControls 
            yearFilter={yearFilter}
            periodFilter={periodFilter}
            onYearFilterChange={setYearFilter}
            onPeriodFilterChange={setPeriodFilter}
          />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="byType" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-blue-50/50 border border-blue-200">
              <TabsTrigger 
                value="byType"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4" />
                Par type d'équipement
              </TabsTrigger>
              <TabsTrigger 
                value="byStatus"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <PieChart className="h-4 w-4" />
                Par statut
              </TabsTrigger>
              <TabsTrigger 
                value="byContractor"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Users className="h-4 w-4" />
                Par entrepreneur
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="byType" className="space-y-4">
              <ChartTypeTab />
            </TabsContent>
            
            <TabsContent value="byStatus" className="space-y-4">
              <ChartStatusTab />
            </TabsContent>
            
            <TabsContent value="byContractor" className="space-y-4">
              <ChartContractorTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
