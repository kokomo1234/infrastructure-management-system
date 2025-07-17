
import { UnifiedCalendar } from "@/components/common/UnifiedCalendar";
import { CalendarEvent, addCalendarEvent } from "@/lib/dataService";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrdersCalendarProps {
  workOrders: WorkOrder[];
}

export function WorkOrdersCalendar({ workOrders }: WorkOrdersCalendarProps) {
  const handleAddMaintenanceEvent = () => {
    // Logique pour ajouter un événement de maintenance
    console.log("Ajouter un événement de maintenance");
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log("Événement maintenance cliqué:", event);
  };

  return (
    <UnifiedCalendar
      title="Calendrier des Interventions"
      showAddButton={true}
      onAddEvent={handleAddMaintenanceEvent}
      filterType="maintenance"
      onEventClick={handleEventClick}
    />
  );
}
