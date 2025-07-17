
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { getStandbyForDate, standbyAssignments, getPersonById } from "@/lib/standbyService";
import { getUserColor } from "@/components/ui/calendar/color-utils";
import { exportStandbyToCSV, exportStandbyToPDF } from "@/lib/standbyExportService";

export function StandbyPersonalCalendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
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
  
  // Calcul des statistiques pour l'utilisateur
  const userAssignments = standbyAssignments.filter(a => a.personId === user?.id);
  const pastAssignments = userAssignments.filter(a => a.endDate < new Date());
  const futureAssignments = userAssignments.filter(a => a.startDate > new Date());
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Calendrier personnel des gardes
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={showOnlyMyShifts ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyMyShifts(!showOnlyMyShifts)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showOnlyMyShifts ? "Toutes les gardes" : "Mes gardes uniquement"}
              </Button>
              <Button variant="outline" size="sm" onClick={exportStandbyToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`h-20 border rounded-lg p-1 ${
                      isMyShift ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
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
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Gardes passées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{pastAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Gardes effectuées</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Gardes à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{futureAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Gardes planifiées</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total cette année</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{userAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Gardes assignées</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Liste des prochaines gardes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Mes prochaines gardes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {futureAssignments.slice(0, 5).map(assignment => {
              const person = getPersonById(assignment.personId);
              return (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback 
                        className="text-white text-xs"
                        style={{ backgroundColor: getUserColor(assignment.personId) }}
                      >
                        {person?.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        Du {format(assignment.startDate, "P", { locale: fr })} au {format(assignment.endDate, "P", { locale: fr })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {assignment.isFullWeek ? "Semaine complète" : "Garde journalière"}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {assignment.isFullWeek ? "7 jours" : "1 jour"}
                  </Badge>
                </div>
              );
            })}
            
            {futureAssignments.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                Aucune garde planifiée
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
