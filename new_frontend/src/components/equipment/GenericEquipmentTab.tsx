
import React from "react";
import CustomizableTable from "@/components/equipment/CustomizableTable";
import { getColumnsByType } from "@/lib/equipmentColumns";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

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

interface GenericEquipmentTabProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  typeId: string;
  typeName: string;
  equipment: Equipment[];
  onRowClick: (equipment: Equipment) => void;
  getStatusColor: (status: string) => string;
  renderActionMenu: (equipment: Equipment) => React.ReactNode;
}

export const GenericEquipmentTab = ({
  title,
  description,
  icon,
  typeId,
  typeName,
  equipment,
  onRowClick,
  getStatusColor,
  renderActionMenu
}: GenericEquipmentTabProps) => {
  const filteredEquipment = equipment.filter(item => 
    typeId === "all" || item.type === typeName
  );

  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomizableTable
          data={filteredEquipment}
          defaultColumns={getColumnsByType(typeName)}
          equipmentType={typeId}
          onRowClick={onRowClick}
          getStatusColor={getStatusColor}
          actionMenu={renderActionMenu}
        />
      </CardContent>
    </>
  );
};
