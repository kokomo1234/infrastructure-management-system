
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { StandbySchedule } from "@/components/dashboard/StandbySchedule";
import { MaintenanceProgress } from "@/components/dashboard/MaintenanceProgress";
import { MaintenanceProgressCharts } from "@/components/maintenance/MaintenanceProgressCharts";

interface WeatherLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface DashboardTabsProps {
  weatherLocations: WeatherLocation[];
  setWeatherLocations: React.Dispatch<React.SetStateAction<WeatherLocation[]>>;
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
}

export function DashboardTabs({ 
  weatherLocations, 
  setWeatherLocations, 
  selectedLocation, 
  onLocationChange 
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="standby">Garde</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <DashboardOverview 
          weatherLocations={weatherLocations}
          setWeatherLocations={setWeatherLocations}
          selectedLocation={selectedLocation}
          onLocationChange={onLocationChange}
        />
      </TabsContent>

      <TabsContent value="standby" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Horaire de garde</CardTitle>
            <CardDescription>Planning mensuel du personnel de garde</CardDescription>
          </CardHeader>
          <CardContent>
            <StandbySchedule />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="maintenance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Suivi de maintenance</CardTitle>
            <CardDescription>Progression détaillée par type d'équipement</CardDescription>
          </CardHeader>
          <CardContent>
            <MaintenanceProgressCharts />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
