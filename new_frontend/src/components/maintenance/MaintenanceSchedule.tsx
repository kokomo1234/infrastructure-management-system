
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanMaintenanceDialog } from "./PlanMaintenanceDialog";
import { mockContractors } from "@/lib/contractorColumns";
import { toast } from "sonner";

// Types pour la planification de maintenance
interface MaintenanceTask {
  id: string;
  equipmentType: string;
  equipmentName: string;
  location: string;
  dueDate: string;
  frequency: string;
  contractor: string;
  status: "Planifié" | "Complété" | "En retard" | "En cours";
}

// Données de test
const maintenanceTasks: MaintenanceTask[] = [
  {
    id: "1",
    equipmentType: "UPS",
    equipmentName: "UPS-MTL-001",
    location: "Centrale Montréal",
    dueDate: "2025-04-15",
    frequency: "Trimestrielle",
    contractor: "MécaFroid Inc.",
    status: "Planifié"
  },
  {
    id: "2",
    equipmentType: "Système DC",
    equipmentName: "DC-MTL-003",
    location: "Centrale Montréal",
    dueDate: "2025-04-18",
    frequency: "Semestrielle",
    contractor: "Électro-Systèmes Québec",
    status: "En cours"
  },
  {
    id: "3",
    equipmentType: "Incendie",
    equipmentName: "FIRE-QUE-001",
    location: "Station Québec",
    dueDate: "2025-04-05",
    frequency: "Annuelle",
    contractor: "Sécurité Incendie Plus",
    status: "En retard"
  },
  {
    id: "4",
    equipmentType: "TSW",
    equipmentName: "TSW-SHE-002",
    location: "Centre Sherbrooke",
    dueDate: "2025-04-20",
    frequency: "Trimestrielle",
    contractor: "Électro-Systèmes Québec",
    status: "Planifié"
  },
  {
    id: "5",
    equipmentType: "Mécanique",
    equipmentName: "HVAC-MTL-004",
    location: "Centrale Montréal",
    dueDate: "2025-03-25",
    frequency: "Mensuelle",
    contractor: "MécaFroid Inc.",
    status: "Complété"
  },
];

export function MaintenanceSchedule() {
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState("all");
  const [contractorFilter, setContractorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tasks, setTasks] = useState(maintenanceTasks);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  
  // Extraire les entrepreneurs uniques pour le filtre
  const contractors = [...new Set(tasks.map(task => task.contractor))];
  
  // Extraire les types d'équipement uniques pour le filtre
  const equipmentTypes = [...new Set(tasks.map(task => task.equipmentType))];
  
  // Filtrer les tâches selon les sélections
  const filteredTasks = tasks.filter(task => {
    const matchesEquipmentType = equipmentTypeFilter === "all" || task.equipmentType === equipmentTypeFilter;
    const matchesContractor = contractorFilter === "all" || task.contractor === contractorFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    return matchesEquipmentType && matchesContractor && matchesStatus;
  });

  // Obtenir la couleur du badge de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planifié": return "bg-blue-100 text-blue-800";
      case "Complété": return "bg-green-100 text-green-800";
      case "En retard": return "bg-red-100 text-red-800";
      case "En cours": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddMaintenanceTask = (task: MaintenanceTask) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtres:</span>
        </div>
        
        <Select value={equipmentTypeFilter} onValueChange={setEquipmentTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type d'équipement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {equipmentTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={contractorFilter} onValueChange={setContractorFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Entrepreneur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les entrepreneurs</SelectItem>
            {contractors.map(contractor => (
              <SelectItem key={contractor} value={contractor}>{contractor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Planifié">Planifié</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Complété">Complété</SelectItem>
            <SelectItem value="En retard">En retard</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Vue calendrier</span>
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsPlanDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Planifier</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type d'équipement</TableHead>
              <TableHead>Équipement</TableHead>
              <TableHead>Emplacement</TableHead>
              <TableHead>Date prévue</TableHead>
              <TableHead>Fréquence</TableHead>
              <TableHead>Entrepreneur</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{task.equipmentType}</TableCell>
                  <TableCell>{task.equipmentName}</TableCell>
                  <TableCell>{task.location}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{task.frequency}</TableCell>
                  <TableCell>{task.contractor}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucune tâche de maintenance trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <PlanMaintenanceDialog 
        open={isPlanDialogOpen} 
        onOpenChange={setIsPlanDialogOpen}
        onSave={handleAddMaintenanceTask}
        equipmentTypes={[...equipmentTypes, "Generatrice"]}
        contractors={mockContractors}
      />
    </div>
  );
}
