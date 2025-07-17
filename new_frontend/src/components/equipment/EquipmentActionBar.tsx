
import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EquipmentType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface EquipmentActionBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddEquipment: (equipment: any) => void;
  equipmentTypes: EquipmentType[];
}

export const EquipmentActionBar = ({
  searchTerm,
  onSearchChange,
  onAddEquipment,
  equipmentTypes
}: EquipmentActionBarProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEquipmentName, setNewEquipmentName] = useState("");
  const [newEquipmentType, setNewEquipmentType] = useState("");
  const [newEquipmentModel, setNewEquipmentModel] = useState("");
  const [newEquipmentLocation, setNewEquipmentLocation] = useState("");
  const [newEquipmentInstallDate, setNewEquipmentInstallDate] = useState("");

  const handleAddNewEquipment = () => {
    if (!newEquipmentName || !newEquipmentType || !newEquipmentModel || !newEquipmentLocation) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const selectedTypeObj = equipmentTypes.find(type => type.id === newEquipmentType);
    if (!selectedTypeObj) {
      toast.error("Type d'équipement invalide");
      return;
    }

    const locationMap: Record<string, string> = {
      "montreal": "Centrale Montréal",
      "quebec": "Station Québec",
      "sherbrooke": "Centre Sherbrooke",
      "gatineau": "Poste Gatineau",
      "laval": "Installation Laval"
    };
    
    const newEquipment = {
      id: `new-${Date.now()}`,
      name: newEquipmentName,
      type: selectedTypeObj.name,
      model: newEquipmentModel,
      location: locationMap[newEquipmentLocation] || newEquipmentLocation,
      installDate: newEquipmentInstallDate || new Date().toISOString().split('T')[0],
      status: "Opérationnel"
    };
    
    onAddEquipment(newEquipment);
    toast.success(`Équipement ${newEquipmentName} ajouté avec succès`);
    
    setNewEquipmentName("");
    setNewEquipmentType("");
    setNewEquipmentModel("");
    setNewEquipmentLocation("");
    setNewEquipmentInstallDate("");
    setIsAddDialogOpen(false);
  };

  return (
    <div className="flex gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher..."
          className="pl-8 w-full sm:w-[260px]"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nouvel équipement</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel équipement</DialogTitle>
            <DialogDescription>
              Saisissez les détails du nouvel équipement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Nom
              </label>
              <Input 
                id="name" 
                className="col-span-3" 
                value={newEquipmentName}
                onChange={(e) => setNewEquipmentName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right">
                Type
              </label>
              <Select value={newEquipmentType} onValueChange={setNewEquipmentType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      <span className="flex items-center gap-2">
                        {type.icon} {type.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="model" className="text-right">
                Modèle
              </label>
              <Input 
                id="model" 
                className="col-span-3" 
                value={newEquipmentModel}
                onChange={(e) => setNewEquipmentModel(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="location" className="text-right">
                Emplacement
              </label>
              <Select value={newEquipmentLocation} onValueChange={setNewEquipmentLocation}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="montreal">Centrale Montréal</SelectItem>
                  <SelectItem value="quebec">Station Québec</SelectItem>
                  <SelectItem value="sherbrooke">Centre Sherbrooke</SelectItem>
                  <SelectItem value="gatineau">Poste Gatineau</SelectItem>
                  <SelectItem value="laval">Installation Laval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="installDate" className="text-right">
                Date d'installation
              </label>
              <Input 
                id="installDate" 
                type="date" 
                className="col-span-3" 
                value={newEquipmentInstallDate}
                onChange={(e) => setNewEquipmentInstallDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddNewEquipment}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
