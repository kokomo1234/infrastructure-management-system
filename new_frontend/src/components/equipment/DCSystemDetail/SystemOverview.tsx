
import { DCSystem } from "@/types/dcSystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Package, Zap } from "lucide-react";
import { calculateAutonomy, calculateTotalInstalledCapacity } from "@/lib/dcSystemService";

interface SystemOverviewProps {
  system: DCSystem;
}

export function SystemOverview({ system }: SystemOverviewProps) {
  const totalCapacity = calculateTotalInstalledCapacity(system);
  const autonomyHours = calculateAutonomy(system);
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Package className="h-4 w-4" /> Aperçu du système
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
        <Card className="bg-blue-50">
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium">Capacité</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3 text-blue-600" />
              <div className="text-xl font-semibold">{totalCapacity} W</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium">Autonomie</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-center space-x-1">
              <Battery className="h-3 w-3 text-green-600" />
              <div className="text-xl font-semibold">{autonomyHours.toFixed(1)} h</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50">
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium">Tension</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3 text-orange-600" />
              <div className="text-xl font-semibold">{system.systemVoltage} V</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardHeader className="py-2">
            <CardTitle className="text-xs font-medium">Charge</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3 text-purple-600" />
              <div className="text-xl font-semibold">{system.totalLoad} W</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
