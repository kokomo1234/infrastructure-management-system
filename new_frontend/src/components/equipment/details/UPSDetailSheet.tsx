
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Battery, Zap, Network, Settings, FileText, Calendar } from "lucide-react";

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

interface UPSDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
}

export function UPSDetailSheet({ open, onOpenChange, equipment }: UPSDetailSheetProps) {
  if (!equipment || equipment.type !== "UPS") return null;

  // Mock data - en production, cela viendrait du backend
  const upsData = {
    // Informations générales
    name: equipment.name,
    model: equipment.model,
    serialNumber: "UPS-SN-2023-001",
    manufacturer: "Schneider Electric",
    installDate: equipment.installDate,
    
    // Informations électriques
    power: "15 kW",
    voltage: "240V / 120V",
    siteLoad: "12 kW",
    chargePercentage: 85,
    autonomy: "45 minutes",
    
    // Informations batteries
    batteryModel: "Genesis EP12-7.2",
    batteryBankCount: 4,
    cellsPerBank: 12,
    totalCells: 48,
    batteryManufactureDate: "2023-03-15",
    batteryAge: "1.8 ans",
    
    // Informations réseau
    ipAddress: "192.168.1.100",
    switchPort: "Port 24",
    gateway: "192.168.1.1",
    netmask: "255.255.255.0",
    macId: "00:1B:44:11:3A:B7",
    
    // Informations fournisseur
    supplierName: "ÉlectroTech Solutions",
    supplierNumber: "514-555-0123",
    contacts: "Jean Tremblay, Marie Dubois",
    email: "service@electrotech.ca",
    
    // Garantie et contrat
    warrantyEndDate: "2025-03-15",
    contractEndDate: "2024-12-31",
    
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <SheetTitle className="text-2xl">{upsData.name}</SheetTitle>
              <SheetDescription className="text-base">
                UPS - {upsData.model}
              </SheetDescription>
            </div>
            <Badge className={getStatusColor(upsData.status)}>
              {upsData.status}
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
                <p className="font-semibold">{upsData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Modèle</p>
                <p className="font-semibold">{upsData.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro de série</p>
                <p className="font-semibold">{upsData.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Manufacturier</p>
                <p className="font-semibold">{upsData.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date d'installation</p>
                <p className="font-semibold">{upsData.installDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Localisation</p>
                <p className="font-semibold">{equipment.location}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations électriques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Informations électriques
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Puissance</p>
                <p className="font-semibold">{upsData.power}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tension</p>
                <p className="font-semibold">{upsData.voltage}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Charge du site</p>
                <p className="font-semibold">{upsData.siteLoad}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">% de charge</p>
                <p className="font-semibold">{upsData.chargePercentage}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Autonomie</p>
                <p className="font-semibold">{upsData.autonomy}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations batteries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                Informations batteries
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Modèle de batterie</p>
                <p className="font-semibold">{upsData.batteryModel}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nb de banc de batterie</p>
                <p className="font-semibold">{upsData.batteryBankCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nb de cellule par banc</p>
                <p className="font-semibold">{upsData.cellsPerBank}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nb de cellule total</p>
                <p className="font-semibold">{upsData.totalCells}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date fabrication batteries</p>
                <p className="font-semibold">{upsData.batteryManufactureDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Âge batteries</p>
                <p className="font-semibold">{upsData.batteryAge}</p>
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
                <p className="font-semibold">{upsData.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Port de switch</p>
                <p className="font-semibold">{upsData.switchPort}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gateway</p>
                <p className="font-semibold">{upsData.gateway}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Netmask</p>
                <p className="font-semibold">{upsData.netmask}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">MAC ID</p>
                <p className="font-semibold">{upsData.macId}</p>
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
                <p className="font-semibold">{upsData.supplierName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro fournisseur</p>
                <p className="font-semibold">{upsData.supplierNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contacts</p>
                <p className="font-semibold">{upsData.contacts}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Courriel</p>
                <p className="font-semibold">{upsData.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Garantie et contrat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Garantie et contrat
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Date de fin de garantie</p>
                <p className="font-semibold">{upsData.warrantyEndDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Échéance du contrat</p>
                <p className="font-semibold">{upsData.contractEndDate}</p>
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
