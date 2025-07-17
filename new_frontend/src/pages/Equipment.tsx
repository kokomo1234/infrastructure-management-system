import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { 
  Battery, Bolt, Edit, FileText, Flame, Gauge, 
  MoreHorizontal, Server, Trash, Wind, PlugZap 
} from "lucide-react";
import { getDCSystem } from "@/lib/dcSystemService";
import { DCSystem } from "@/types/dcSystem";
import { DCSystemDetailSheet } from "@/components/equipment/DCSystemDetailSheet";
import { DCSystemEditDialog } from "@/components/equipment/DCSystemEditDialog";
import { UPSDetailSheet } from "@/components/equipment/details/UPSDetailSheet";
import { MechanicalDetailSheet } from "@/components/equipment/details/MechanicalDetailSheet";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getColumnsByType } from "@/lib/equipmentColumns";
import { EquipmentTypeTabs } from "@/components/equipment/EquipmentTypeTabs";
import { EquipmentActionBar } from "@/components/equipment/EquipmentActionBar";
import { DCSystemTab } from "@/components/equipment/DCSystemTab";
import { BatteriesTab } from "@/components/equipment/BatteriesTab";
import { InvertersTab } from "@/components/equipment/InvertersTab";
import { GenericEquipmentTab } from "@/components/equipment/GenericEquipmentTab";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

const initialEquipmentData: Equipment[] = [
  {
    id: "1",
    name: "DC-MTL-001",
    type: "Système DC",
    model: "PowerDC 5000",
    location: "Centrale Montréal",
    installDate: "2022-03-15",
    status: "Opérationnel"
  },
  {
    id: "2",
    name: "UPS-MTL-002",
    type: "UPS",
    model: "PowerGuard X3",
    location: "Centrale Montréal",
    installDate: "2021-09-10",
    status: "Opérationnel"
  },
  {
    id: "3",
    name: "GEN-QC-001",
    type: "Generatrice",
    model: "GenPower 800kW",
    location: "Station Québec",
    installDate: "2020-05-22",
    status: "Maintenance prévue"
  },
  {
    id: "4",
    name: "TSW-MTL-001",
    type: "TSW",
    model: "SwitchMaster 12000",
    location: "Centrale Montréal",
    installDate: "2022-01-08",
    status: "Opérationnel"
  },
  {
    id: "5",
    name: "UAC-SHE-001",
    type: "Mécanique",
    model: "CoolAir 5500",
    location: "Centre Sherbrooke",
    installDate: "2019-11-30",
    status: "Réparation requise"
  },
  {
    id: "6",
    name: "FIR-MTL-001",
    type: "Incendie",
    model: "FireGuard Pro",
    location: "Centrale Montréal",
    installDate: "2021-04-17",
    status: "Opérationnel"
  }
];

const equipmentTypes = [
  { id: "dc", name: "Système DC", icon: <Battery className="h-5 w-5" /> },
  { id: "ups", name: "UPS", icon: <Bolt className="h-5 w-5" /> },
  { id: "gen", name: "Generatrice", icon: <Gauge className="h-5 w-5" /> },
  { id: "tsw", name: "TSW", icon: <Server className="h-5 w-5" /> },
  { id: "mech", name: "Mécanique", icon: <Wind className="h-5 w-5" /> },
  { id: "fire", name: "Incendie", icon: <Flame className="h-5 w-5" /> },
  { id: "battery", name: "Batteries", icon: <Battery className="h-5 w-5" /> },
  { id: "inverter", name: "Onduleurs", icon: <PlugZap className="h-5 w-5" /> }
];

const Equipment = () => {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>(initialEquipmentData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dcSystemDetailOpen, setDCSystemDetailOpen] = useState(false);
  const [dcSystemEditOpen, setDCSystemEditOpen] = useState(false);
  const [upsDetailOpen, setUpsDetailOpen] = useState(false);
  const [mechanicalDetailOpen, setMechanicalDetailOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const navigate = useNavigate();
  const dcSystem = getDCSystem();

  const dcSystemEquipment: Equipment = {
    id: dcSystem.id,
    name: dcSystem.name,
    type: "Système DC",
    model: dcSystem.model,
    location: dcSystem.location,
    installDate: "2023-05-15",
    status: "Opérationnel"
  };

  const combinedEquipment = [...equipmentData, dcSystemEquipment];
  
  const filteredEquipment = combinedEquipment.filter(equip => {
    const matchesSearch = searchTerm === "" || 
      equip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = selectedType === null || equip.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Opérationnel": return "bg-green-100 text-green-800";
      case "Maintenance prévue": return "bg-blue-100 text-blue-800";
      case "Réparation requise": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSystemClick = () => {
    setDCSystemDetailOpen(true);
  };

  const handleEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    
    switch (equipment.type) {
      case "UPS":
        setUpsDetailOpen(true);
        break;
      case "Mécanique":
        setMechanicalDetailOpen(true);
        break;
      default:
        // Pour les autres types, garde l'ancienne fiche générique temporairement
        console.log("Type d'équipement non supporté:", equipment.type);
        break;
    }
  };

  const handleSystemUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleAddNewEquipment = (newEquipment: Equipment) => {
    setEquipmentData(prev => [...prev, newEquipment]);
  };

  const handleGoToDCSystem = () => {
    try {
      navigate('/dc-system');
    } catch (error) {
      toast.error("Erreur de navigation vers la page du système DC");
      console.error("Navigation error:", error);
    }
  };

  const renderActionMenu = (equipment: Equipment) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {equipment.type === "Système DC" && equipment.id === dcSystem.id ? (
            <>
              <DropdownMenuItem onClick={() => setDCSystemEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGoToDCSystem}>
                <Server className="mr-2 h-4 w-4" />
                <span>Gérer les composants</span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => handleEquipmentClick(equipment)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Détails</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Historique</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            <span>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Équipements</h2>
        <p className="text-muted-foreground">
          Gérez tous les équipements d'infrastructure de votre réseau.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <EquipmentTypeTabs 
            equipmentTypes={equipmentTypes} 
            onSelectType={setSelectedType} 
          />

          <EquipmentActionBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddEquipment={handleAddNewEquipment}
            equipmentTypes={equipmentTypes}
          />
        </div>

        <TabsContent value="all" className="mt-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <GenericEquipmentTab
                title="Tous les équipements"
                description="Liste de tous les équipements"
                icon={<Server className="h-5 w-5" />}
                typeId="all"
                typeName=""
                equipment={filteredEquipment}
                onRowClick={(equipment) => 
                  equipment.type === "Système DC" && equipment.id === dcSystem.id
                    ? handleSystemClick()
                    : handleEquipmentClick(equipment)
                }
                getStatusColor={getStatusColor}
                renderActionMenu={renderActionMenu}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {equipmentTypes.map(type => (
          <TabsContent key={type.id} value={type.id} className="mt-6">
            <Card className="overflow-hidden">
              {type.id === "battery" ? (
                <BatteriesTab 
                  dcSystem={dcSystem}
                  handleSystemClick={handleSystemClick}
                  handleGoToDCSystem={handleGoToDCSystem}
                />
              ) : type.id === "inverter" ? (
                <InvertersTab 
                  dcSystem={dcSystem}
                  handleSystemClick={handleSystemClick}
                  handleGoToDCSystem={handleGoToDCSystem}
                />
              ) : type.id === "dc" ? (
                <CardContent>
                  <DCSystemTab 
                    dcSystem={dcSystem}
                    onEditSystem={() => setDCSystemEditOpen(true)}
                    onSystemClick={handleSystemClick}
                    onGoToDCSystem={handleGoToDCSystem}
                  />
                </CardContent>
              ) : (
                <GenericEquipmentTab
                  title={type.name}
                  description={`Gestion des équipements de type ${type.name.toLowerCase()}`}
                  icon={type.icon}
                  typeId={type.id}
                  typeName={type.name}
                  equipment={filteredEquipment}
                  onRowClick={handleEquipmentClick}
                  getStatusColor={getStatusColor}
                  renderActionMenu={renderActionMenu}
                />
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <DCSystemDetailSheet 
        open={dcSystemDetailOpen}
        onOpenChange={setDCSystemDetailOpen}
        onUpdate={handleSystemUpdate}
      />
      
      <DCSystemEditDialog 
        open={dcSystemEditOpen}
        onOpenChange={setDCSystemEditOpen}
        onUpdate={handleSystemUpdate}
      />

      <UPSDetailSheet
        open={upsDetailOpen}
        onOpenChange={setUpsDetailOpen}
        equipment={selectedEquipment}
      />

      <MechanicalDetailSheet
        open={mechanicalDetailOpen}
        onOpenChange={setMechanicalDetailOpen}
        equipment={selectedEquipment}
      />
    </div>
  );
};

export default Equipment;
