
import { useState } from "react";
import { getCurrentStandby, getNextStandby } from "@/lib/standbyService";
import { StandbyRequestDialog } from "./standby/StandbyRequestDialog";
import { StandbyManageDialog } from "./standby/StandbyManageDialog";
import { StandbyExchangeDialog } from "@/components/standby/StandbyExchangeDialog";
import { StandbyWeekCard } from "./standby/StandbyWeekCard";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StandbyScheduleProps {
  compact?: boolean;
}

export function StandbySchedule({ compact = false }: StandbyScheduleProps) {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const thisWeekStandby = getCurrentStandby();
  const nextWeekStandby = getNextStandby();
  
  const isAdmin = user?.role === "admin";
  const isCurrentUser = thisWeekStandby?.id === user?.id;
  
  const handleViewFullCalendar = () => {
    navigate('/standby');
  };
  
  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Horaire de garde</h3>
          <Button variant="outline" size="sm" onClick={handleViewFullCalendar}>
            <CalendarRange className="h-4 w-4 mr-2" />
            Voir calendrier complet
          </Button>
        </div>
      )}
      
      <StandbyWeekCard 
        title="Cette semaine"
        person={thisWeekStandby}
        borderColor="border-infra-blue"
        bgColor="bg-blue-50"
        showRequestButton={!!thisWeekStandby && isCurrentUser}
        onRequestClick={() => setRequestDialogOpen(true)}
      />

      {!compact && (
        <StandbyWeekCard 
          title="Semaine prochaine"
          person={nextWeekStandby}
          borderColor="border-gray-300"
          bgColor="bg-gray-50"
          showManageButton={isAdmin}
          onManageClick={() => setManageDialogOpen(true)}
        />
      )}

      {thisWeekStandby && isCurrentUser && (
        <StandbyRequestDialog 
          open={requestDialogOpen} 
          onOpenChange={setRequestDialogOpen} 
          currentPerson={thisWeekStandby} 
        />
      )}
      
      <StandbyManageDialog 
        open={manageDialogOpen} 
        onOpenChange={setManageDialogOpen} 
      />
    </div>
  );
}
