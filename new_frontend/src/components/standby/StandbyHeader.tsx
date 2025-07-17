
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, UserPlus, Shuffle, CalendarRange } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface StandbyHeaderProps {
  viewMode: "calendar" | "list";
  setViewMode: (mode: "calendar" | "list") => void;
  openAssignDialog: () => void;
  openYearlyPlanningDialog: () => void;
  openRandomAssignDialog: () => void;
}

export function StandbyHeader({
  viewMode,
  setViewMode,
  openAssignDialog,
  openYearlyPlanningDialog,
  openRandomAssignDialog,
}: StandbyHeaderProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <Tabs
        value={viewMode}
        onValueChange={(value) => setViewMode(value as "calendar" | "list")}
        className="w-full sm:w-auto"
      >
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Calendrier</span>
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Liste</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isAdmin && (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={openAssignDialog}>
            <UserPlus className="h-4 w-4 mr-2" />
            <span>Assigner</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={openYearlyPlanningDialog}>
            <CalendarRange className="h-4 w-4 mr-2" />
            <span>Planning annuel</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={openRandomAssignDialog}>
            <Shuffle className="h-4 w-4 mr-2" />
            <span>Assignation aléatoire</span>
          </Button>
        </div>
      )}
    </div>
  );
}
