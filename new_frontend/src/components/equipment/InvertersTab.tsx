
import React from "react";
import { DCSystem } from "@/types/dcSystem";
import CustomizableTable from "@/components/equipment/CustomizableTable";
import { Button } from "@/components/ui/button";
import { PlugZap } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface InvertersTabProps {
  dcSystem: DCSystem;
  handleSystemClick: () => void;
  handleGoToDCSystem: () => void;
}

export const InvertersTab = ({ dcSystem, handleSystemClick, handleGoToDCSystem }: InvertersTabProps) => {
  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PlugZap className="h-5 w-5" />
          <CardTitle>Onduleurs</CardTitle>
        </div>
        <CardDescription>
          Liste de tous les onduleurs dans les systèmes DC
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomizableTable
          data={dcSystem.inverters.map(inverter => ({
            id: inverter.id,
            name: inverter.name,
            capacity: `${inverter.capacity} W`,
            efficiency: inverter.efficiency ? `${inverter.efficiency}%` : "N/A",
            dcSystem: dcSystem.name
          }))}
          defaultColumns={[
            { id: "name", label: "Nom", accessor: "name" },
            { id: "capacity", label: "Capacité (W)", accessor: "capacity" },
            { id: "efficiency", label: "Efficacité", accessor: "efficiency" },
            { id: "dcSystem", label: "Système DC", accessor: "dcSystem" },
          ]}
          equipmentType="inverter"
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
