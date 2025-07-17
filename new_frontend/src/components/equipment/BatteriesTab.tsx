
import React from "react";
import { DCSystem } from "@/types/dcSystem";
import CustomizableTable from "@/components/equipment/CustomizableTable";
import { Button } from "@/components/ui/button";
import { Battery } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface BatteriesTabProps {
  dcSystem: DCSystem;
  handleSystemClick: () => void;
  handleGoToDCSystem: () => void;
}

export const BatteriesTab = ({ dcSystem, handleSystemClick, handleGoToDCSystem }: BatteriesTabProps) => {
  const calculateBatteryAge = (dateString?: string): string => {
    if (!dateString) return "N/A";
    
    const manufacture = new Date(dateString);
    const today = new Date();
    
    const ageInYears = today.getFullYear() - manufacture.getFullYear();
    const monthDiff = today.getMonth() - manufacture.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < manufacture.getDate())) {
      return `${ageInYears - 1} ans, ${12 + monthDiff} mois`;
    }
    
    return `${ageInYears} ans, ${monthDiff} mois`;
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-CA');
  };
  
  const getTypeLabel = (type: string) => {
    switch(type) {
      case "lithium-ion": return "Lithium-ion";
      case "lead-acid": return "Plomb-acide";
      case "other": return "Autre";
      default: return type;
    }
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Battery className="h-5 w-5" />
          <CardTitle>Batteries</CardTitle>
        </div>
        <CardDescription>
          Liste de toutes les batteries dans les systèmes DC
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomizableTable
          data={dcSystem.batteryPacks.map(battery => ({
            id: battery.id,
            name: battery.name,
            type: getTypeLabel(battery.type),
            capacityAh: `${battery.capacityAh} Ah`,
            dcSystem: dcSystem.name,
            cellCount: battery.cellCount || "N/A",
            manufactureDate: battery.manufactureDate ? formatDate(battery.manufactureDate) : "N/A",
            age: battery.manufactureDate ? calculateBatteryAge(battery.manufactureDate) : "N/A",
            rechargeCurrent: battery.rechargeCurrent ? `${battery.rechargeCurrent} A` : "N/A",
            standardResistance: battery.standardResistance || "N/A",
            lastInspection: battery.lastInspectionDate ? formatDate(battery.lastInspectionDate) : "N/A",
            nextInspection: battery.nextInspectionDate ? formatDate(battery.nextInspectionDate) : "N/A",
            rating: battery.rating ? `${battery.rating}/10` : "N/A",
            comments: battery.comments || "N/A"
          }))}
          defaultColumns={[
            { id: "name", label: "Nom", accessor: "name" },
            { id: "type", label: "Type", accessor: "type" },
            { id: "capacityAh", label: "Capacité (Ah)", accessor: "capacityAh" },
            { id: "cellCount", label: "NB accumulateur", accessor: "cellCount" },
            { id: "age", label: "Âge", accessor: "age" },
            { id: "manufactureDate", label: "Date de fabrication", accessor: "manufactureDate" },
            { id: "rechargeCurrent", label: "Courant de recharge", accessor: "rechargeCurrent" },
            { id: "standardResistance", label: "Résistance étalon", accessor: "standardResistance" },
            { id: "lastInspection", label: "Dernière inspection", accessor: "lastInspection" },
            { id: "nextInspection", label: "Prochaine inspection", accessor: "nextInspection" },
            { id: "rating", label: "Côte", accessor: "rating" },
            { id: "comments", label: "Commentaire", accessor: "comments" },
            { id: "dcSystem", label: "Système DC", accessor: "dcSystem" },
          ]}
          equipmentType="battery"
          onRowClick={handleSystemClick}
          actionMenu={() => (
            <Button variant="ghost" size="sm" onClick={handleGoToDCSystem}>
              Gérer
            </Button>
          )}
        />
      </CardContent>
    </>
  );
};
