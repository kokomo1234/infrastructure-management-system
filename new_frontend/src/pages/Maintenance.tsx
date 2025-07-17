
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceSchedule } from "@/components/maintenance/MaintenanceSchedule";
import { MaintenanceProgressCharts } from "@/components/maintenance/MaintenanceProgressCharts";
import { MaintenanceProgress } from "@/components/dashboard/MaintenanceProgress";

const Maintenance = () => {
  const [viewMode, setViewMode] = useState<"schedule" | "progress">("schedule");

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Maintenance</h2>
        <p className="text-muted-foreground">
          Planifiez et suivez les activités de maintenance pour tous les équipements.
        </p>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4" onValueChange={(value) => setViewMode(value as "schedule" | "progress")}>
        <TabsList>
          <TabsTrigger value="schedule">Programme de maintenance</TabsTrigger>
          <TabsTrigger value="progress">Suivi de progression</TabsTrigger>
          <TabsTrigger value="equipment">Par type d'équipement</TabsTrigger>
          <TabsTrigger value="contractor">Par entrepreneur</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Programme de maintenance</CardTitle>
              <CardDescription>Vue d'ensemble des activités planifiées</CardDescription>
            </CardHeader>
            <CardContent>
              <MaintenanceSchedule />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Suivi de progression</CardTitle>
              <CardDescription>Analyse détaillée de l'avancement des maintenances</CardDescription>
            </CardHeader>
            <CardContent>
              <MaintenanceProgressCharts />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance par type d'équipement</CardTitle>
              <CardDescription>Progression détaillée par type d'équipement</CardDescription>
            </CardHeader>
            <CardContent>
              <MaintenanceProgress />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contractor">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance par entrepreneur</CardTitle>
              <CardDescription>Activités regroupées par entrepreneur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <p>Cette fonctionnalité sera disponible prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;
