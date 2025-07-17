import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Info, Network, Shield, Zap, Gauge, Settings, Battery, Wrench
} from "lucide-react";
import { EquipmentHeader, EquipmentInfoSection, EquipmentDocumentation, EquipmentHistory } from "./EquipmentDetailSheet/index";
import { EquipmentWorkOrdersHistory } from "./EquipmentWorkOrdersHistory";

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

interface EquipmentDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
}

export function EquipmentDetailSheet({ 
  open, 
  onOpenChange, 
  equipment 
}: EquipmentDetailSheetProps) {
  if (!equipment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Opérationnel": return "bg-green-100 text-green-800";
      case "Maintenance prévue": return "bg-blue-100 text-blue-800";
      case "Réparation requise": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "N/A";
    if (typeof value === 'boolean') return value ? "Oui" : "Non";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === 'string' && value.includes('T')) {
      try {
        return new Date(value).toLocaleDateString("fr-CA");
      } catch {
        return value;
      }
    }
    return value.toString();
  };

  // Informations générales incluant la localisation
  const generalInfo = {
    "Nom d'équipement": equipment.name,
    "Type d'équipement": equipment.type,
    "Modèle": equipment.model,
    "Marque": equipment.brand,
    "Numéro de série": equipment.serialNumber,
    "Statut": equipment.status,
    "Date d'installation": equipment.installDate,
    "Emplacement": equipment.location,
    "Complexe": equipment.complexe,
    "TDL": equipment.tdl,
    "Adresse": equipment.address,
    "Ville": equipment.city,
    "Code Postal": equipment.postalCode,
    "Région": equipment.region
  };

  // Spécifications techniques étendues
  const technicalSpecs = {
    "Puissance (KW)": equipment.power,
    "Puissance (Ton)": equipment.powerTon,
    "Tension": equipment.voltage,
    "Capacité": equipment.capacity,
    "Charge": equipment.load,
    "Charge du site (KW)": equipment.siteLoad,
    "% d'utilisation": equipment.usagePercentage,
    "% de charge": equipment.chargePercentage || equipment.loadPercentage,
    "Autonomie": equipment.autonomy,
    "Autonomie (En Mins)": equipment.autonomy,
    "Nb de phase": equipment.phaseCount,
    "Bypass": equipment.bypass || equipment.hasBypass,
    "Présence bypass": equipment.hasBypass,
    "Redondance": equipment.redundancy,
    "Nombre de stage": equipment.stageCount
  };

  // Informations batteries
  const batteryInfo = {
    "Modèle de batterie": equipment.batteryModel,
    "Type de batterie": equipment.batteryType,
    "Nb de banc de batterie": equipment.batteryBankCount,
    "Nb de cellule par banc": equipment.cellsPerBank,
    "Nb de cellule total": equipment.totalCells,
    "Date fabrication des batteries": equipment.batteryManufactureDate,
    "Date d'installation des batteries": equipment.batteryInstallDate,
    "Âge batteries": equipment.batteryAge,
    "Commentaires batteries": equipment.batteryComments
  };

  // Informations fournisseur étendues
  const supplierInfo = {
    "Nom du fournisseur": equipment.supplierName,
    "NO de fournisseur": equipment.supplierNumber,
    "Contacts": equipment.contacts,
    "Numéro d'escalade": equipment.escalationNumber,
    "Courriel": equipment.email,
    "Manufacturier": equipment.manufacturer,
    "Compagnie de service": equipment.serviceCompany,
    "Compagnie qui a installé l'équipement": equipment.installerCompany
  };

  // Configuration réseau étendue
  const networkInfo = {
    "Adresse IP": equipment.ipAddress,
    "Gateway": equipment.gateway,
    "Netmask": equipment.netmask,
    "Port de switch": equipment.switchPort,
    "MAC ID": equipment.macId,
    "Nom d'utilisateur": equipment.username,
    "Mot de passe": equipment.password,
    "Mot de passe de service": equipment.servicePassword,
    "Mot de passe accès à distance": equipment.remoteAccessPassword
  };

  // Maintenance étendue
  const maintenanceInfo = {
    "Âge": equipment.age,
    "Âge UPS": equipment.age,
    "Date de fin de garantie": equipment.warrantyEndDate,
    "Échéance du contrat": equipment.contractEndDate,
    "Entretien mineur": equipment.minorMaintenance,
    "Entretien majeur": equipment.majorMaintenance,
    "Commentaire entretiens": equipment.maintenanceComments,
    "Dernier essai fuite": equipment.lastLeakTest,
    "Dernier test hydrostatique": equipment.lastHydrostaticTest,
    "Date d'essai de fuite d'air Préaction": equipment.preactionAirLeakTest
  };

  // Informations spécifiques mécaniques
  const mechanicalInfo = {
    "Unité de plus de 5.4T": equipment.isOver54T,
    "Réfrigérant": equipment.refrigerant,
    "Quantité total de réfrigérant": equipment.refrigerantQuantity,
    "Zone couverte": equipment.coveredZone,
    "Filtre(s)": equipment.filters,
    "Quantité de filtre": equipment.filterQuantity,
    "Courroie(s)": equipment.belts,
    "Quantité de Courroie": equipment.beltQuantity,
    "# de la fiche de mise en service": equipment.serviceSheetNumber
  };

  // Informations spécifiques incendie
  const fireSystemInfo = {
    "Modèle du contrôleur": equipment.controllerModel,
    "Date manomètre": equipment.manometerDate,
    "Entrebarrage (Simple, double, N/D)": equipment.interlocking,
    "Délai cyclique (minutes)": equipment.cyclicDelay,
    "Zone simple ou croisée": equipment.zoneType,
    "Présence de robinet d'essai": equipment.hasTestValve,
    "Signal basse/très basse pression": equipment.pressureSignal,
    "Plaque signalétique": equipment.hasNameplate,
    "Modèle du panneau de relâche": equipment.releasePanel,
    "Adressable ou conventionnel": equipment.systemType,
    "Contacts envoyés (A, T, S, E ou T&S)": equipment.sentContacts,
    "Mixing ou arrêt": equipment.mixingOrStop
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl overflow-y-auto">
        <EquipmentHeader equipment={equipment} getStatusColor={getStatusColor} />
        
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Détails complets</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <EquipmentInfoSection
              title="Informations générales"
              data={generalInfo}
              icon={<Info className="h-5 w-5" />}
              getStatusColor={getStatusColor}
              formatValue={formatValue}
            />
            
            <EquipmentInfoSection
              title="Spécifications techniques"
              data={technicalSpecs}
              icon={<Zap className="h-5 w-5" />}
              formatValue={formatValue}
            />
            
            <EquipmentInfoSection
              title="Informations batteries"
              data={batteryInfo}
              icon={<Battery className="h-5 w-5" />}
              formatValue={formatValue}
            />
            
            <EquipmentInfoSection
              title="Informations fournisseur"
              data={supplierInfo}
              icon={<Shield className="h-5 w-5" />}
              formatValue={formatValue}
            />
            
            <EquipmentInfoSection
              title="Configuration réseau"
              data={networkInfo}
              icon={<Network className="h-5 w-5" />}
              formatValue={formatValue}
            />
            
            <EquipmentInfoSection
              title="Maintenance"
              data={maintenanceInfo}
              icon={<Wrench className="h-5 w-5" />}
              formatValue={formatValue}
            />

            <EquipmentInfoSection
              title="Équipement mécanique"
              data={mechanicalInfo}
              icon={<Gauge className="h-5 w-5" />}
              formatValue={formatValue}
            />

            <EquipmentInfoSection
              title="Système incendie"
              data={fireSystemInfo}
              icon={<Settings className="h-5 w-5" />}
              formatValue={formatValue}
            />

            <EquipmentDocumentation />
          </TabsContent>

          <TabsContent value="interventions" className="space-y-4">
            <EquipmentWorkOrdersHistory 
              equipmentId={equipment.id}
              equipmentName={equipment.name}
            />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <EquipmentHistory equipment={equipment} />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
          <Button>Modifier</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
