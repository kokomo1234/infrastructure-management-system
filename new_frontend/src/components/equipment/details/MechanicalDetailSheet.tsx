
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Wind, Thermometer, Network, Settings, FileText, Calendar, Wrench } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  location: string;
  installDate: string;
  status: string;
  [key: string]: any;
}

interface MechanicalDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
}

export function MechanicalDetailSheet({ open, onOpenChange, equipment }: MechanicalDetailSheetProps) {
  if (!equipment || equipment.type !== "Mécanique") return null;

  // Mock data spécifique aux équipements mécaniques
  const mechanicalData = {
    // Informations générales
    name: equipment.name,
    model: equipment.model,
    serialNumber: "MECH-SN-2019-001",
    manufacturer: "Carrier",
    installDate: equipment.installDate,
    
    // Informations techniques
    powerTon: "55 Tonnes",
    isOver54T: "Oui",
    refrigerant: "R-410A",
    refrigerantQuantity: "12.5 kg",
    stageCount: 2,
    redundancy: "N+1",
    
    // Zones et filtres
    coveredZone: "Salle serveurs A, B, C",
    filters: "MERV 13",
    filterQuantity: 8,
    belts: "4L480",
    beltQuantity: 3,
    
    // Maintenance
    lastLeakTest: "2024-09-15",
    minorMaintenance: "Trimestrielle",
    majorMaintenance: "Annuelle",
    maintenanceComments: "Remplacement filtre prévu en janvier",
    
    // Informations réseau
    ipAddress: "192.168.1.105",
    gateway: "192.168.1.1",
    netmask: "255.255.255.0",
    switchPort: "Port 12",
    servicePassword: "Carrier2024",
    remoteAccessPassword: "Remote@2024",
    
    // Fournisseur
    supplierName: "Clima-Tech Inc.",
    supplierNumber: "514-555-0789",
    contacts: "Pierre Lavoie, Sophie Martin",
    escalationNumber: "514-555-HELP",
    email: "service@climatech.ca",
    serviceCompany: "TechServ HVAC",
    
    // Installation
    installerCompany: "Installation Plus",
    serviceSheetNumber: "MS-2019-0456",
    
    status: equipment.status
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Opérationnel": return "bg-green-100 text-green-800";
      case "Maintenance prévue": return "bg-blue-100 text-blue-800";
      case "Réparation requise": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Wind className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <SheetTitle className="text-2xl">{mechanicalData.name}</SheetTitle>
              <SheetDescription className="text-base">
                Équipement mécanique - {mechanicalData.model}
              </SheetDescription>
            </div>
            <Badge className={getStatusColor(mechanicalData.status)}>
              {mechanicalData.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nom d'équipement</p>
                <p className="font-semibold">{mechanicalData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Modèle</p>
                <p className="font-semibold">{mechanicalData.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro de série</p>
                <p className="font-semibold">{mechanicalData.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Manufacturier</p>
                <p className="font-semibold">{mechanicalData.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date d'installation</p>
                <p className="font-semibold">{mechanicalData.installDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Localisation</p>
                <p className="font-semibold">{equipment.location}</p>
              </div>
            </CardContent>
          </Card>

          {/* Spécifications techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Spécifications techniques
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Puissance (Tonnes)</p>
                <p className="font-semibold">{mechanicalData.powerTon}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Unité de plus de 5.4T</p>
                <p className="font-semibold">{mechanicalData.isOver54T}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Réfrigérant</p>
                <p className="font-semibold">{mechanicalData.refrigerant}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Quantité réfrigérant</p>
                <p className="font-semibold">{mechanicalData.refrigerantQuantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre de stages</p>
                <p className="font-semibold">{mechanicalData.stageCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Redondance</p>
                <p className="font-semibold">{mechanicalData.redundancy}</p>
              </div>
            </CardContent>
          </Card>

          {/* Zone et composants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Zone et composants
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Zone couverte</p>
                <p className="font-semibold">{mechanicalData.coveredZone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Filtres</p>
                <p className="font-semibold">{mechanicalData.filters}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Quantité de filtres</p>
                <p className="font-semibold">{mechanicalData.filterQuantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Courroies</p>
                <p className="font-semibold">{mechanicalData.belts}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Quantité de courroies</p>
                <p className="font-semibold">{mechanicalData.beltQuantity}</p>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Dernier test de fuite</p>
                <p className="font-semibold">{mechanicalData.lastLeakTest}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Entretien mineur</p>
                <p className="font-semibold">{mechanicalData.minorMaintenance}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Entretien majeur</p>
                <p className="font-semibold">{mechanicalData.majorMaintenance}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Commentaires maintenance</p>
                <p className="font-semibold">{mechanicalData.maintenanceComments}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations réseau */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Informations réseau
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Adresse IP</p>
                <p className="font-semibold">{mechanicalData.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Port de switch</p>
                <p className="font-semibold">{mechanicalData.switchPort}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gateway</p>
                <p className="font-semibold">{mechanicalData.gateway}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Netmask</p>
                <p className="font-semibold">{mechanicalData.netmask}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mot de passe service</p>
                <p className="font-semibold">{mechanicalData.servicePassword}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mot de passe accès distant</p>
                <p className="font-semibold">{mechanicalData.remoteAccessPassword}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations fournisseur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informations fournisseur
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nom du fournisseur</p>
                <p className="font-semibold">{mechanicalData.supplierName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro fournisseur</p>
                <p className="font-semibold">{mechanicalData.supplierNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contacts</p>
                <p className="font-semibold">{mechanicalData.contacts}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro d'escalade</p>
                <p className="font-semibold">{mechanicalData.escalationNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Courriel</p>
                <p className="font-semibold">{mechanicalData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Compagnie de service</p>
                <p className="font-semibold">{mechanicalData.serviceCompany}</p>
              </div>
            </CardContent>
          </Card>

          {/* Installation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Installation
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Compagnie d'installation</p>
                <p className="font-semibold">{mechanicalData.installerCompany}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">N° fiche de mise en service</p>
                <p className="font-semibold">{mechanicalData.serviceSheetNumber}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Voir l'historique
          </Button>
          <Button variant="outline" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
