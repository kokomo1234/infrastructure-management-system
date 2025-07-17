
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  getEventsForDate, 
  getUserById, 
  getSiteById, 
  getEquipmentById,
  CalendarEvent 
} from "@/lib/dataService";
import { CalendarNoteDialog } from "@/components/dashboard/CalendarNoteDialog";

interface UnifiedCalendarProps {
  title?: string;
  showAddButton?: boolean;
  onAddEvent?: () => void;
  filterType?: 'standby' | 'maintenance' | 'project' | 'vacation';
  onEventClick?: (event: CalendarEvent) => void;
}

export function UnifiedCalendar({ 
  title = "Calendrier", 
  showAddButton = false,
  onAddEvent,
  filterType,
  onEventClick
}: UnifiedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNotesRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

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

  const getEventColor = (event: CalendarEvent): string => {
    switch (event.type) {
      case 'standby': return '#3B82F6';
      case 'maintenance': return '#F59E0B';
      case 'project': return '#10B981';
      case 'vacation': return '#EF4444';
      case 'note': return '#8B5CF6';
      default: return event.color || '#6B7280';
    }
  };

  const getEventLabel = (event: CalendarEvent): string => {
    switch (event.type) {
      case 'standby':
        const user = event.userId ? getUserById(event.userId) : null;
        return user ? user.initials : 'G';
      case 'maintenance':
        return 'M';
      case 'project':
        return 'P';
      case 'vacation':
        return 'V';
      case 'note':
        return 'N';
      default:
        return '•';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            {showAddButton && onAddEvent && (
              <Button size="sm" onClick={onAddEvent}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentDate, "MMMM yyyy", { locale: fr })}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Légende */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Gardes</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Projets</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Vacances</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Notes</span>
            </div>
          </div>
          
          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-1">
            {/* En-têtes des jours */}
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
            
            {/* Cases vides pour aligner le premier jour */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, index) => (
              <div key={`empty-${index}`} className="h-20" />
            ))}
            
            {/* Jours du mois */}
            {daysInMonth.map(day => {
              const dayEvents = getEventsForDate(day);
              const filteredEvents = filterType 
                ? dayEvents.filter(event => event.type === filterType)
                : dayEvents;
              
              return (
                <div
                  key={day.toISOString()}
                  className="h-20 border rounded-lg p-1 relative group bg-white border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium">
                      {format(day, "d")}
                    </div>
                    <CalendarNoteDialog 
                      date={day} 
                      onNoteAdded={handleNotesRefresh}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    {filteredEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className="flex items-center justify-center rounded text-white text-xs font-bold w-4 h-4 cursor-pointer"
                        style={{ backgroundColor: getEventColor(event) }}
                        title={event.title}
                        onClick={() => onEventClick && onEventClick(event)}
                      >
                        {getEventLabel(event)}
                      </div>
                    ))}
                    {filteredEvents.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{filteredEvents.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
