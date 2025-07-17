
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, UserPlus, Clock, Filter } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { getStandbyForDate } from "@/lib/standbyService";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getUserColor } from "@/components/ui/calendar/color-utils";

interface StandbyCalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  openAssignDialog: () => void;
}

export function StandbyCalendarView({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  openAssignDialog
}: StandbyCalendarViewProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [showOnlyMyShifts, setShowOnlyMyShifts] = useState(false);
  
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const renderStandbyInfoForSelectedDate = () => {
    if (!selectedDate) return null;
    
    const standbyPerson = getStandbyForDate(selectedDate);
    
    return (
      <div className="mt-4 p-4 border rounded-lg bg-muted/20">
        <h3 className="font-medium mb-2">
          {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
        </h3>
        
        {standbyPerson ? (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {standbyPerson.avatar ? (
                <img src={standbyPerson.avatar} alt={standbyPerson.name} />
              ) : (
                <AvatarFallback 
                  className="text-white"
                  style={{ backgroundColor: getUserColor(standbyPerson.id) }}
                >
                  {standbyPerson.initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-medium">{standbyPerson.name}</div>
              <div className="flex space-x-3 text-sm text-muted-foreground">
                <span>{standbyPerson.phone}</span>
                <span>{standbyPerson.email}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">
            Aucune personne assignée pour cette date
          </div>
        )}
        
        {isAdmin && (
          <div className="mt-4">
            <Button onClick={openAssignDialog} size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              {standbyPerson ? "Modifier l'assignation" : "Assigner une personne"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendrier des gardes</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={showOnlyMyShifts ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyMyShifts(!showOnlyMyShifts)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showOnlyMyShifts ? "Toutes les gardes" : "Mes gardes uniquement"}
            </Button>
            <Button onClick={openAssignDialog}>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter une garde
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] pb-8">
        <div className="flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Les gardes commencent le vendredi à 16h et se terminent le vendredi suivant à 7h
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Navigation du calendrier */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {format(currentDate, "MMMM yyyy", { locale: fr })}
              </h2>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-1">
              {/* En-têtes des jours */}
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
              
              {/* Cases vides pour aligner le premier jour */}
              {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, index) => (
                <div key={`empty-${index}`} className="h-20" />
              ))}
              
              {/* Jours du mois */}
              {daysInMonth.map(day => {
                const standbyPerson = getStandbyForDate(day);
                const isMyShift = standbyPerson?.id === user?.id;
                const shouldShow = !showOnlyMyShifts || isMyShift;
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                
                return (
                  <TooltipProvider key={day.toISOString()}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-20 border rounded-lg p-1 cursor-pointer transition-colors ${
                            isSelected ? 'border-blue-500 bg-blue-50' :
                            isMyShift ? 'bg-blue-50 border-blue-200' : 
                            'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleDayClick(day)}
                        >
                          <div className="text-sm font-medium">
                            {format(day, "d")}
                          </div>
                          
                          {shouldShow && standbyPerson && (
                            <div className="mt-1">
                              <div 
                                className="flex items-center justify-center rounded-full text-white text-xs font-bold w-6 h-6"
                                style={{ backgroundColor: getUserColor(standbyPerson.id) }}
                              >
                                {standbyPerson.initials}
                              </div>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      {standbyPerson && (
                        <TooltipContent>
                          <p>Garde: {standbyPerson.name}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
          
          {selectedDate && renderStandbyInfoForSelectedDate()}
        </div>
      </CardContent>
    </Card>
  );
}
