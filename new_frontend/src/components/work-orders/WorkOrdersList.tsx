
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  MoreHorizontal, Edit, Trash, Eye, MessageSquare, 
  Calendar, User, MapPin 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { WorkOrder } from "@/types/workOrder";
import { mockContractors } from "@/lib/contractorColumns";

interface WorkOrdersListProps {
  workOrders: WorkOrder[];
  getStatusColor: (status: WorkOrder['status']) => string;
  getPriorityColor: (priority: WorkOrder['priority']) => string;
  getStatusIcon: (status: WorkOrder['status']) => React.ReactNode;
}

const mockEquipment = [
  { id: "1", name: "DC-MTL-001", type: "Système DC", model: "PowerDC 5000", location: "Centrale Montréal" },
  { id: "2", name: "UPS-MTL-002", type: "UPS", model: "PowerGuard X3", location: "Centrale Montréal" },
  { id: "3", name: "GEN-QC-001", type: "Generatrice", model: "GenPower 800kW", location: "Station Québec" },
  { id: "4", name: "TSW-MTL-001", type: "TSW", model: "SwitchMaster 12000", location: "Centrale Montréal" },
  { id: "5", name: "UAC-SHE-001", type: "Mécanique", model: "CoolAir 5500", location: "Centre Sherbrooke" }
];

export function WorkOrdersList({ 
  workOrders, 
  getStatusColor, 
  getPriorityColor, 
  getStatusIcon 
}: WorkOrdersListProps) {
  const getEquipmentInfo = (equipmentIds: string[]) => {
    return mockEquipment.filter(eq => equipmentIds.includes(eq.id));
  };

  const getContractorInfo = (contractorId: string) => {
    return mockContractors.find(c => c.id === contractorId);
  };

  const getStatusText = (status: WorkOrder['status']) => {
    switch (status) {
      case "draft": return "Brouillon";
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
        <CardTitle>Appels de service ({workOrders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Équipements</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map((workOrder) => {
              const equipment = getEquipmentInfo(workOrder.equipmentIds);
              const contractor = getContractorInfo(workOrder.contractorId);
              
              return (
                <TableRow key={workOrder.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{workOrder.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {workOrder.description}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(workOrder.status)} variant="secondary">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(workOrder.status)}
                        {getStatusText(workOrder.status)}
                      </div>
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getPriorityColor(workOrder.priority)} variant="secondary">
                      {getPriorityText(workOrder.priority)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {equipment.slice(0, 2).map((eq) => (
                        <div key={eq.id} className="text-sm">
                          <div className="font-medium">{eq.name}</div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {eq.location}
                          </div>
                        </div>
                      ))}
                      {equipment.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{equipment.length - 2} autres
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {contractor ? (
                      <div className="text-sm">
                        <div className="font-medium">{contractor.company}</div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {contractor.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Non assigné</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {new Date(workOrder.createdAt).toLocaleDateString("fr-CA")}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {workOrder.dueDate ? (
                      <div className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(workOrder.dueDate).toLocaleDateString("fr-CA")}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Voir détails</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Ajouter commentaire</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
