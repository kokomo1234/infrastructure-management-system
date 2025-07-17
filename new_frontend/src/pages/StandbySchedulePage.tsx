import { useState } from "react";
import { StandbyHeader } from "@/components/standby/StandbyHeader";
import { StandbyCalendarView } from "@/components/standby/StandbyCalendarView";
import { StandbyListView } from "@/components/standby/StandbyListView";
import { StandbyChangeRequests } from "@/components/standby/StandbyChangeRequests";
import { StandbyAssignDialog } from "@/components/standby/StandbyAssignDialog";
import { StandbyYearlyPlanningDialog } from "@/components/standby/StandbyYearlyPlanningDialog";
import { StandbyRandomAssignDialog } from "@/components/standby/StandbyRandomAssignDialog";
import { StandbyNotifications } from "@/components/standby/StandbyNotifications";
import { StandbyExchangeDialog } from "@/components/standby/StandbyExchangeDialog";
import { StandbyPersonalCalendar } from "@/components/standby/StandbyPersonalCalendar";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ArrowLeftRight, Settings, Shuffle } from "lucide-react";

export default function StandbySchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [yearlyPlanningOpen, setYearlyPlanningOpen] = useState(false);
  const [randomAssignOpen, setRandomAssignOpen] = useState(false);
  const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "personal">("calendar");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const openAssignDialog = (assignmentId: string | null = null, personId: string = "") => {
    setSelectedAssignmentId(assignmentId);
    setSelectedPersonId(personId);
    setAssignDialogOpen(true);
  };

  const openYearlyPlanningDialog = () => {
    setYearlyPlanningOpen(true);
  };

  const openRandomAssignDialog = () => {
    setRandomAssignOpen(true);
  };

  const openExchangeDialog = () => {
    setExchangeDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Gestion des gardes
              </CardTitle>
              <CardDescription>
                Planifiez les périodes de garde pour l'équipe. Les périodes commencent le vendredi à 16h et se terminent le vendredi suivant à 7h.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={openExchangeDialog} variant="outline">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Échanger
              </Button>
              {isAdmin && (
                <>
                  <Button onClick={openRandomAssignDialog} variant="outline">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Assignation aléatoire
                  </Button>
                  <Button onClick={openYearlyPlanningDialog}>
                    <Settings className="h-4 w-4 mr-2" />
                    Planning annuel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list" | "personal")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendrier
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Personnel
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar">
              <StandbyHeader 
                viewMode="calendar" 
                setViewMode={setViewMode} 
                openAssignDialog={openAssignDialog}
                openYearlyPlanningDialog={openYearlyPlanningDialog}
                openRandomAssignDialog={openRandomAssignDialog}
              />
              <StandbyCalendarView 
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                openAssignDialog={openAssignDialog}
              />
            </TabsContent>
            
            <TabsContent value="list">
              <StandbyHeader 
                viewMode="list" 
                setViewMode={setViewMode} 
                openAssignDialog={openAssignDialog}
                openYearlyPlanningDialog={openYearlyPlanningDialog}
                openRandomAssignDialog={openRandomAssignDialog}
              />
              <StandbyListView 
                openAssignDialog={openAssignDialog} 
              />
            </TabsContent>
            
            <TabsContent value="personal">
              <StandbyPersonalCalendar />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {isAdmin && (
        <StandbyChangeRequests />
      )}
      
      <StandbyNotifications />
      
      <StandbyAssignDialog 
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        selectedAssignmentId={selectedAssignmentId}
        selectedPersonId={selectedPersonId}
        setSelectedPersonId={setSelectedPersonId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <StandbyYearlyPlanningDialog
        open={yearlyPlanningOpen}
        onOpenChange={setYearlyPlanningOpen}
      />

      <StandbyRandomAssignDialog
        open={randomAssignOpen}
        onOpenChange={setRandomAssignOpen}
      />

      <StandbyExchangeDialog
        open={exchangeDialogOpen}
        onOpenChange={setExchangeDialogOpen}
      />
    </div>
  );
}
