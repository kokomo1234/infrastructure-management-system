
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, Calendar, Phone, CheckSquare, BarChart3, ClipboardCheck } from "lucide-react";
import { WorkScheduleTab } from "@/components/personnel/WorkScheduleTab";
import { VacationRequestsTab } from "@/components/personnel/VacationRequestsTab";
import { StandbyManagementTab } from "@/components/personnel/StandbyManagementTab";
import { TasksProjectsTab } from "@/components/personnel/TasksProjectsTab";
import { WorkloadTrackingTab } from "@/components/personnel/WorkloadTrackingTab";
import { TimeTrackingTab } from "@/components/personnel/TimeTrackingTab";

export default function PersonnelManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("schedule");

  // Vérifier les permissions
  if (user?.role !== "supervisor" && user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Accès refusé</CardTitle>
            <CardDescription className="text-center">
              Cette section est réservée aux superviseurs et administrateurs.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Gestion du Personnel</CardTitle>
              <CardDescription>
                Gérez les horaires, vacances, gardes et tâches de votre équipe
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horaires
              </TabsTrigger>
              <TabsTrigger value="vacations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Vacances
              </TabsTrigger>
              <TabsTrigger value="standby" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Garde
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Tâches
              </TabsTrigger>
              <TabsTrigger value="workload" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Charge
              </TabsTrigger>
              <TabsTrigger value="timetracking" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Présence
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule">
              <WorkScheduleTab />
            </TabsContent>

            <TabsContent value="vacations">
              <VacationRequestsTab />
            </TabsContent>

            <TabsContent value="standby">
              <StandbyManagementTab />
            </TabsContent>

            <TabsContent value="tasks">
              <TasksProjectsTab />
            </TabsContent>

            <TabsContent value="workload">
              <WorkloadTrackingTab />
            </TabsContent>

            <TabsContent value="timetracking">
              <TimeTrackingTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
