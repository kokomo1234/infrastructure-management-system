
import { UnifiedCalendar } from "@/components/common/UnifiedCalendar";
import { CalendarEvent, addCalendarEvent } from "@/lib/dataService";
import { Task } from "@/types/project";

interface TaskCalendarProps {
  tasks: Task[];
}

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  // Synchroniser les tâches avec le système centralisé
  const handleAddProjectEvent = () => {
    // Logique pour ajouter un événement projet
    console.log("Ajouter un événement projet");
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log("Événement cliqué:", event);
  };

  return (
    <UnifiedCalendar
      title="Calendrier des Projets"
      showAddButton={true}
      onAddEvent={handleAddProjectEvent}
      filterType="project"
      onEventClick={handleEventClick}
    />
  );
}
