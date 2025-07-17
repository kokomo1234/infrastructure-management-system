
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Battery, Bolt, Gauge, Server, Wind, Flame, PlugZap } from "lucide-react";

interface EquipmentType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface EquipmentTypeTabsProps {
  equipmentTypes: EquipmentType[];
  onSelectType: (typeName: string | null) => void;
}

export const EquipmentTypeTabs = ({ equipmentTypes, onSelectType }: EquipmentTypeTabsProps) => {
  return (
    <TabsList>
      <TabsTrigger value="all" onClick={() => onSelectType(null)}>Tous</TabsTrigger>
      {equipmentTypes.map(type => (
        <TabsTrigger key={type.id} value={type.id} onClick={() => onSelectType(type.name)}>
          <span className="flex items-center gap-1.5">
            {type.icon}
            <span className="hidden sm:inline">{type.name}</span>
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
