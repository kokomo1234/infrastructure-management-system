
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDCSystem, calculateTotalInstalledCapacity, calculateTotalBatteryCapacity, calculateAutonomy } from "@/lib/dcSystemService";
import { DCSystemConfig } from "./DCSystemConfig";
import { RectifiersList } from "./RectifiersList";
import { CBDBList } from "./CBDBList";
import { BatteryPacksList } from "./BatteryPacksList";
import { InvertersList } from "./InvertersList";
import { Gauge, Zap, Battery, CircuitBoard, PlugZap } from "lucide-react";

export function DCSystemOverview() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  const system = getDCSystem();
  const totalCapacity = calculateTotalInstalledCapacity(system);
  const totalBatteryAh = calculateTotalBatteryCapacity(system);
  const autonomyHours = calculateAutonomy(system);

  const handleComponentChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4" key={refreshKey}>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="rectifiers">Redresseurs</TabsTrigger>
          <TabsTrigger value="cbdb">CBDB</TabsTrigger>
          <TabsTrigger value="battery">Batteries</TabsTrigger>
          <TabsTrigger value="inverters">Onduleurs</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Système DC - {system.name}</CardTitle>
              <CardDescription>Vue d'ensemble du système d'alimentation DC</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Capacité installée</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <div className="text-2xl font-bold">{totalCapacity} W</div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Base: {system.baseCapacity}W + Redresseurs: {totalCapacity - system.baseCapacity}W
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Autonomie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Battery className="h-4 w-4 text-green-600" />
                      <div className="text-2xl font-bold">{autonomyHours.toFixed(2)} h</div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Batteries: {totalBatteryAh} Ah, Charge: {system.totalLoad} W
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">CBDBs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <CircuitBoard className="h-4 w-4 text-purple-600" />
                      <div className="text-2xl font-bold">{system.cdbds.length}</div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tension du système: {system.systemVoltage}V
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-orange-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Onduleurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <PlugZap className="h-4 w-4 text-orange-600" />
                      <div className="text-2xl font-bold">{system.inverters.length}</div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Capacité totale: {system.inverters.reduce((sum, inv) => sum + inv.capacity, 0)}W
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Composition du système</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Redresseurs ({system.rectifiers.length})</h4>
                    {system.rectifiers.length > 0 ? (
                      <ul className="text-sm space-y-1">
                        {system.rectifiers.slice(0, 4).map(r => (
                          <li key={r.id} className="text-muted-foreground">{r.name}: {r.capacity}W</li>
                        ))}
                        {system.rectifiers.length > 4 && <li className="text-muted-foreground">+{system.rectifiers.length - 4} autres...</li>}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun redresseur ajouté</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Batteries ({system.batteryPacks.length})</h4>
                    {system.batteryPacks.length > 0 ? (
                      <ul className="text-sm space-y-1">
                        {system.batteryPacks.slice(0, 4).map(b => (
                          <li key={b.id} className="text-muted-foreground">{b.name}: {b.capacityAh}Ah ({b.type})</li>
                        ))}
                        {system.batteryPacks.length > 4 && <li className="text-muted-foreground">+{system.batteryPacks.length - 4} autres...</li>}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun pack de batteries ajouté</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rectifiers">
          <RectifiersList onComponentChange={handleComponentChange} />
        </TabsContent>
        
        <TabsContent value="cbdb">
          <CBDBList onComponentChange={handleComponentChange} />
        </TabsContent>
        
        <TabsContent value="battery">
          <BatteryPacksList onComponentChange={handleComponentChange} />
        </TabsContent>
        
        <TabsContent value="inverters">
          <InvertersList onComponentChange={handleComponentChange} />
        </TabsContent>
        
        <TabsContent value="config">
          <DCSystemConfig onComponentChange={handleComponentChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
