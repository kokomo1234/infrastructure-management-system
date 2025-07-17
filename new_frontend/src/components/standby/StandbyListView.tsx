
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, UserPlus, CalendarClock } from "lucide-react";
import { format, addWeeks, isAfter, isSameDay, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { StandbyRequestDialog } from "@/components/dashboard/standby/StandbyRequestDialog";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  standbyAssignments, 
  standbyPeople, 
  getPersonById
} from "@/lib/standbyService";

interface StandbyListViewProps {
  openAssignDialog: (assignmentId: string | null, personId: string) => void;
}

export function StandbyListView({ openAssignDialog }: StandbyListViewProps) {
  const { user } = useAuth();
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  
  const isAdmin = user?.role === "admin";
  
  // Generate weeks for the list view
  const generateWeeks = () => {
    const weeks = [];
    let startDate = new Date();
    // Find the current or next Friday
    while (startDate.getDay() !== 5) { // 5 is Friday
      startDate.setDate(startDate.getDate() + 1);
    }
    startDate.setHours(16, 0, 0, 0); // 4pm
    
    const today = new Date();
    if (isAfter(today, startDate)) {
      // If today is after this Friday 4pm, start from next Friday
      startDate = addDays(startDate, 7);
    }
    
    for (let i = -1; i < 8; i++) { // Start from -1 to include current week
      const weekStartDate = addWeeks(startDate, i);
      const weekEndDate = addWeeks(weekStartDate, 1);
      weekEndDate.setHours(7, 0, 0, 0); // 7am
      
      const assignmentsForWeek = standbyAssignments.filter(
        a => a.isFullWeek && 
        isSameDay(a.startDate, weekStartDate) &&
        isSameDay(a.endDate, weekEndDate)
      );
      
      const dailyAssignments = standbyAssignments.filter(
        a => !a.isFullWeek && 
        a.startDate >= weekStartDate && 
        a.endDate <= weekEndDate
      );
      
      weeks.push({
        startDate: weekStartDate,
        endDate: weekEndDate,
        assignments: assignmentsForWeek,
        dailyAssignments
      });
    }
    
    return weeks;
  };
  
  const weeks = generateWeeks();
  
  const handleRequestReplacement = (assignmentId: string, personId: string) => {
    setSelectedAssignment(assignmentId);
    setSelectedPerson(personId);
    setRequestDialogOpen(true);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Liste des gardes</CardTitle>
          {isAdmin && (
            <Button onClick={() => openAssignDialog(null, "")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter une garde
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Période</TableHead>
              <TableHead>Personne de garde</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weeks.map((week, index) => {
              const mainAssignment = week.assignments[0];
              const standbyPerson = mainAssignment 
                ? getPersonById(mainAssignment.personId) 
                : undefined;
                
              // Daily assignments (overrides)
              const dailyAssignments = week.dailyAssignments;
              
              const now = new Date();
              const isCurrentWeek = week.startDate <= now && week.endDate > now;
              const isPastWeek = week.endDate < now;
              
              return (
                <TableRow 
                  key={index} 
                  className={isCurrentWeek ? "bg-blue-50 dark:bg-blue-950/20" : ""}
                >
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">
                      {isCurrentWeek && (
                        <Badge className="bg-infra-blue text-white">Actuelle</Badge>
                      )}
                      Du {format(week.startDate, "P", { locale: fr })} à 16h
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Au {format(week.endDate, "P", { locale: fr })} à 7h
                    </div>
                    {dailyAssignments.length > 0 && (
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30">
                          {dailyAssignments.length} remplacement(s)
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {standbyPerson ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {standbyPerson.avatar ? (
                            <img src={standbyPerson.avatar} alt={standbyPerson.name} />
                          ) : (
                            <AvatarFallback className="bg-infra-blue text-white text-xs">
                              {standbyPerson.initials}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>{standbyPerson.name}</div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Non assigné</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {standbyPerson ? (
                      <div className="space-y-1">
                        <div className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {standbyPerson.phone}
                        </div>
                        <div className="text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {standbyPerson.email}
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">-</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {isAdmin && !isPastWeek && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            openAssignDialog(
                              mainAssignment?.id || null, 
                              mainAssignment?.personId || ""
                            );
                          }}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                      )}
                      
                      {standbyPerson && !isPastWeek && user && standbyPerson.id === user.id && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRequestReplacement(
                            mainAssignment?.id || '', 
                            mainAssignment?.personId || ''
                          )}
                        >
                          <CalendarClock className="h-3 w-3 mr-1" />
                          Demander remplacement
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {selectedPerson && (
          <StandbyRequestDialog
            open={requestDialogOpen}
            onOpenChange={setRequestDialogOpen}
            currentPerson={standbyPeople.find(p => p.id === selectedPerson) || standbyPeople[0]}
          />
        )}
      </CardContent>
    </Card>
  );
}
