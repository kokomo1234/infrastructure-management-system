
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

interface PlanMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (maintenanceTask: any) => void;
  equipmentTypes: string[];
  contractors: { id: string; company: string; serviceTypes: string[] }[];
}

export function PlanMaintenanceDialog({
  open,
  onOpenChange,
  onSave,
  equipmentTypes,
  contractors
}: PlanMaintenanceDialogProps) {
  const [selectedType, setSelectedType] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [frequency, setFrequency] = useState("");
  const [selectedContractorId, setSelectedContractorId] = useState("");
  
  const filteredContractors = selectedType 
    ? contractors.filter(c => c.serviceTypes.includes(selectedType))
    : contractors;

  const handleSave = () => {
    // Validation
    if (!selectedType || !equipmentName || !location || !date || !frequency || !selectedContractorId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const selectedContractor = contractors.find(c => c.id === selectedContractorId);
    
    const maintenanceTask = {
      id: `task-${Date.now()}`,
      equipmentType: selectedType,
      equipmentName,
      location,
      dueDate: format(date, "yyyy-MM-dd"),
      frequency,
      contractor: selectedContractor?.company || "",
      status: "Planifié"
    };

    onSave(maintenanceTask);
    toast.success("Maintenance planifiée avec succès");
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setSelectedType("");
    setEquipmentName("");
    setLocation("");
    setDate(undefined);
    setFrequency("");
    setSelectedContractorId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Planifier une maintenance</DialogTitle>
          <DialogDescription>
            Complétez les détails pour programmer une nouvelle tâche de maintenance.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentType">Type d'équipement *</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="equipmentType">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipmentName">Nom de l'équipement *</Label>
              <Input
                id="equipmentName"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Emplacement *</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Sélectionner un emplacement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Centrale Montréal">Centrale Montréal</SelectItem>
                <SelectItem value="Station Québec">Station Québec</SelectItem>
                <SelectItem value="Centre Sherbrooke">Centre Sherbrooke</SelectItem>
                <SelectItem value="Poste Gatineau">Poste Gatineau</SelectItem>
                <SelectItem value="Installation Laval">Installation Laval</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date prévue *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dueDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Fréquence *</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Sélectionner une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                  <SelectItem value="Trimestrielle">Trimestrielle</SelectItem>
                  <SelectItem value="Semestrielle">Semestrielle</SelectItem>
                  <SelectItem value="Annuelle">Annuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contractor">Entrepreneur *</Label>
            <Select value={selectedContractorId} onValueChange={setSelectedContractorId}>
              <SelectTrigger id="contractor">
                <SelectValue placeholder="Sélectionner un entrepreneur" />
              </SelectTrigger>
              <SelectContent>
                {filteredContractors.map(contractor => (
                  <SelectItem key={contractor.id} value={contractor.id}>
                    {contractor.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedType && filteredContractors.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                Aucun entrepreneur disponible pour ce type d'équipement
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave}>Planifier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
