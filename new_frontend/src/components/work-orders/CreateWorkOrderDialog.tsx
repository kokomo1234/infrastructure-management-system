
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Wrench, FileText, Send, Copy } from "lucide-react";
import { WorkOrderMessageGenerator } from "./WorkOrderMessageGenerator";
import { mockContractors } from "@/lib/contractorColumns";
import { toast } from "sonner";

// Mock des équipements pour la sélection
const mockEquipment = [
  { id: "1", name: "DC-MTL-001", type: "Système DC", model: "PowerDC 5000", location: "Centrale Montréal", brand: "PowerTech", serialNumber: "DC001-2022" },
  { id: "2", name: "UPS-MTL-002", type: "UPS", model: "PowerGuard X3", location: "Centrale Montréal", brand: "GuardPower", serialNumber: "UPS002-2021" },
  { id: "3", name: "GEN-QC-001", type: "Generatrice", model: "GenPower 800kW", location: "Station Québec", brand: "GenMaster", serialNumber: "GEN001-2020" },
  { id: "4", name: "TSW-MTL-001", type: "TSW", model: "SwitchMaster 12000", location: "Centrale Montréal", brand: "SwitchTech", serialNumber: "TSW001-2022" },
  { id: "5", name: "UAC-SHE-001", type: "Mécanique", model: "CoolAir 5500", location: "Centre Sherbrooke", brand: "AirCool", serialNumber: "UAC001-2019" }
];

interface CreateWorkOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkOrderDialog({ open, onOpenChange }: CreateWorkOrderDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    equipmentId: "",
    contractorId: "",
    dueDate: "",
    estimatedHours: ""
  });

  const selectedEquipment = mockEquipment.find(eq => eq.id === formData.equipmentId);
  const selectedContractor = mockContractors.find(c => c.id === formData.contractorId);

  // Auto-remplissage du fournisseur basé sur l'équipement sélectionné
  const handleEquipmentChange = (equipmentId: string) => {
    setFormData(prev => ({ ...prev, equipmentId }));
    
    // Auto-sélection du fournisseur basé sur le type d'équipement
    const equipment = mockEquipment.find(eq => eq.id === equipmentId);
    if (equipment) {
      const contractorForEquipment = mockContractors.find(contractor => 
        contractor.serviceTypes.some(type => 
          type.toLowerCase().includes(equipment.type.toLowerCase()) ||
          equipment.type.toLowerCase().includes(type.toLowerCase())
        )
      );
      
      if (contractorForEquipment) {
        setFormData(prev => ({ ...prev, contractorId: contractorForEquipment.id }));
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error("Veuillez remplir le titre et la description");
      return;
    }
    if (!formData.equipmentId) {
      toast.error("Veuillez sélectionner un équipement");
      return;
    }
    
    toast.success("Appel de service créé avec succès!");
    onOpenChange(false);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      equipmentId: "",
      contractorId: "",
      dueDate: "",
      estimatedHours: ""
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Créer un appel de service
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Détails de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Détails de l'appel de service</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Titre de l'appel de service</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Panne UPS - Centrale Montréal"
                />
              </div>

              <div>
                <Label htmlFor="description">Description du problème</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez en détail le problème rencontré..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dueDate">Date d'échéance</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="estimatedHours">Temps estimé (heures)</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                  placeholder="Ex: 4"
                />
              </div>
            </div>
          </div>

          {/* Sélection d'équipement */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Équipement concerné</h3>
            <div>
              <Label htmlFor="equipment">Sélectionner l'équipement</Label>
              <Select value={formData.equipmentId} onValueChange={handleEquipmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un équipement..." />
                </SelectTrigger>
                <SelectContent>
                  {mockEquipment.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{equipment.name}</span>
                        <span className="text-xs text-muted-foreground">{equipment.type} - {equipment.location}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Informations auto-remplies de l'équipement */}
            {selectedEquipment && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Informations de l'équipement</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Localisation:</span>
                      <p className="text-muted-foreground">{selectedEquipment.location}</p>
                    </div>
                    <div>
                      <span className="font-medium">Modèle:</span>
                      <p className="text-muted-foreground">{selectedEquipment.model}</p>
                    </div>
                    <div>
                      <span className="font-medium">Numéro de série:</span>
                      <p className="text-muted-foreground">{selectedEquipment.serialNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium">Marque:</span>
                      <p className="text-muted-foreground">{selectedEquipment.brand}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Fournisseur auto-sélectionné */}
          {selectedContractor && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fournisseur de service</h3>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">{selectedContractor.company}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{selectedContractor.email}</p>
                      <p className="text-sm text-muted-foreground">{selectedContractor.serviceNumber}</p>
                      <div className="flex gap-1 mt-2">
                        {selectedContractor.serviceTypes.map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Message généré */}
          {formData.title && formData.equipmentId && selectedContractor && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Message généré</h3>
              <WorkOrderMessageGenerator
                workOrder={{
                  title: formData.title,
                  description: formData.description,
                  priority: formData.priority,
                  equipment: selectedEquipment ? [selectedEquipment] : [],
                  contractor: selectedContractor,
                  dueDate: formData.dueDate,
                  estimatedHours: formData.estimatedHours
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Créer l'appel de service
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
