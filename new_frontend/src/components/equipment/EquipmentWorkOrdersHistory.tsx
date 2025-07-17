
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Calendar, Plus, FileText } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";

interface EquipmentWorkOrdersHistoryProps {
  equipmentId: string;
  equipmentName: string;
}

// Mock des appels de service pour cet équipement
const mockWorkOrdersForEquipment = (equipmentId: string): WorkOrder[] => {
  const allWorkOrders: WorkOrder[] = [
    {
      id: "wo-001",
      title: "Panne UPS - Centrale Montréal",
      description: "L'UPS UPS-MTL-002 présente des alarmes de batterie faible.",
      priority: "high",
      status: "completed",
      equipmentIds: ["2"],
      contractorId: "contractor-1",
      createdBy: "user-1",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T16:45:00Z",
      completedAt: "2024-01-20T16:45:00Z",
      estimatedHours: 4,
      actualHours: 3.5
    },
    {
      id: "wo-004",
      title: "Maintenance préventive UPS",
      description: "Maintenance trimestrielle de l'UPS incluant test des batteries.",
      priority: "medium",
      status: "completed",
      equipmentIds: ["2"],
      contractorId: "contractor-1",
      createdBy: "user-2",
      createdAt: "2023-12-10T08:00:00Z",
      updatedAt: "2023-12-12T14:30:00Z",
      completedAt: "2023-12-12T14:30:00Z",
      estimatedHours: 2,
      actualHours: 2.5
    },
    {
      id: "wo-005",
      title: "Remplacement ventilateur DC",
      description: "Remplacement du ventilateur défaillant sur le système DC-MTL-001.",
      priority: "medium",
      status: "completed",
      equipmentIds: ["1"],
      contractorId: "contractor-2",
      createdBy: "user-1",
      createdAt: "2023-11-22T13:15:00Z",
      updatedAt: "2023-11-24T10:30:00Z",
      completedAt: "2023-11-24T10:30:00Z",
      estimatedHours: 3,
      actualHours: 4
    }
  ];

  return allWorkOrders.filter(wo => wo.equipmentIds.includes(equipmentId));
};

export function EquipmentWorkOrdersHistory({ equipmentId, equipmentName }: EquipmentWorkOrdersHistoryProps) {
  const workOrders = mockWorkOrdersForEquipment(equipmentId);

  const getStatusColor = (status: WorkOrder['status']) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: WorkOrder['status']) => {
    switch (status) {
      case "pending": return "En attente";
      case "in-progress": return "En cours";
      case "completed": return "Terminé";
      case "cancelled": return "Annulé";
      default: return status;
    }
  };

  const getPriorityText = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case "low": return "Faible";
      case "medium": return "Moyenne";
      case "high": return "Élevée";
      case "urgent": return "Urgent";
      default: return priority;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Historique des interventions
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle intervention
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {workOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune intervention enregistrée pour cet équipement</p>
            <Button className="mt-4" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Créer un appel de service
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {workOrders.map((workOrder) => (
              <div key={workOrder.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{workOrder.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {workOrder.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(workOrder.createdAt).toLocaleDateString("fr-CA")}
                      </div>
                      
                      {workOrder.actualHours && (
                        <div className="text-sm text-muted-foreground">
                          Durée: {workOrder.actualHours}h
                        </div>
                      )}
                      
                      {workOrder.completedAt && (
                        <div className="text-sm text-muted-foreground">
                          Terminé le: {new Date(workOrder.completedAt).toLocaleDateString("fr-CA")}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(workOrder.status)} variant="secondary">
                      {getStatusText(workOrder.status)}
                    </Badge>
                    <Badge className={getPriorityColor(workOrder.priority)} variant="secondary">
                      {getPriorityText(workOrder.priority)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-4 border-t">
              <Button variant="outline" size="sm">
                Voir tous les appels de service
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
