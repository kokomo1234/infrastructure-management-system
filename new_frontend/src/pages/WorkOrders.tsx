import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, Wrench, FileText, Clock, CheckCircle, 
  AlertTriangle, Calendar, Filter, Settings 
} from "lucide-react";
import { CreateWorkOrderDialog } from "@/components/work-orders/CreateWorkOrderDialog";
import { WorkOrdersList } from "@/components/work-orders/WorkOrdersList";
import { WorkOrdersStats } from "@/components/work-orders/WorkOrdersStats";
import { WorkOrdersCalendar } from "@/components/work-orders/WorkOrdersCalendar";
import { WorkOrder } from "@/types/workOrder";

// Mock data pour les appels de service
const mockWorkOrders: WorkOrder[] = [
  {
    id: "wo-001",
    title: "Panne UPS - Centrale Montréal",
    description: "L'UPS UPS-MTL-002 présente des alarmes de batterie faible. Nécessite intervention urgente.",
    priority: "high",
    status: "pending",
    equipmentIds: ["2"],
    contractorId: "contractor-1",
    createdBy: "user-1",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    dueDate: "2024-01-17T17:00:00Z",
    estimatedHours: 4,
    tags: ["urgent", "ups", "batterie"]
  },
  {
    id: "wo-002",
    title: "Maintenance préventive - Système DC",
    description: "Maintenance trimestrielle programmée pour le système DC-MTL-001",
    priority: "medium",
    status: "in-progress",
    equipmentIds: ["1"],
    contractorId: "contractor-2",
    createdBy: "user-2",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    dueDate: "2024-01-20T16:00:00Z",
    estimatedHours: 6,
    actualHours: 3,
    tags: ["maintenance", "préventif"]
  },
  {
    id: "wo-003",
    title: "Réparation climatisation",
    description: "Unité UAC-SHE-001 ne refroidit plus correctement. Vérification du système de réfrigération nécessaire.",
    priority: "medium",
    status: "completed",
    equipmentIds: ["5"],
    contractorId: "contractor-3",
    createdBy: "user-1",
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    completedAt: "2024-01-12T16:45:00Z",
    estimatedHours: 8,
    actualHours: 6,
    tags: ["réparation", "climatisation"]
  }
];

const WorkOrders = () => {
  const [workOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = searchTerm === "" || 
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === null || wo.status === selectedStatus;
    const matchesPriority = selectedPriority === null || wo.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: WorkOrder['status']) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
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

  const getStatusIcon = (status: WorkOrder['status']) => {
    switch (status) {
      case "draft": return <FileText className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "in-progress": return <Wrench className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Appels de service</h2>
        <p className="text-muted-foreground">
          Gérez les interventions et la maintenance de vos équipements.
        </p>
      </div>

      <WorkOrdersStats workOrders={workOrders} />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un appel de service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80"
          />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel appel de service
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Tableau
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <WorkOrdersList 
            workOrders={filteredWorkOrders}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <WorkOrdersCalendar workOrders={filteredWorkOrders} />
        </TabsContent>

        <TabsContent value="board" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["pending", "in-progress", "completed", "cancelled"].map(status => (
              <Card key={status}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                    {getStatusIcon(status as WorkOrder['status'])}
                    {status === "pending" ? "En attente" :
                     status === "in-progress" ? "En cours" :
                     status === "completed" ? "Terminé" : "Annulé"}
                    <Badge variant="secondary" className="ml-auto">
                      {filteredWorkOrders.filter(wo => wo.status === status).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filteredWorkOrders
                    .filter(wo => wo.status === status)
                    .map(wo => (
                      <div key={wo.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium text-sm">{wo.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {wo.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={getPriorityColor(wo.priority)} variant="secondary">
                            {wo.priority === "low" ? "Faible" :
                             wo.priority === "medium" ? "Moyenne" :
                             wo.priority === "high" ? "Élevée" : "Urgent"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(wo.createdAt).toLocaleDateString("fr-CA")}
                          </span>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateWorkOrderDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};

export default WorkOrders;