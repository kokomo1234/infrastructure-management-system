
import { Badge } from "@/components/ui/badge";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EquipmentExportService } from "../EquipmentExportService";

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

interface EquipmentHeaderProps {
  equipment: Equipment;
  getStatusColor: (status: string) => string;
}

export function EquipmentHeader({ equipment, getStatusColor }: EquipmentHeaderProps) {
  return (
    <SheetHeader className="pb-6">
      <div className="flex justify-between items-start">
        <div>
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span>{equipment.name}</span>
            <Badge variant="outline" className={getStatusColor(equipment.status)}>
              {equipment.status}
            </Badge>
          </SheetTitle>
          <SheetDescription className="text-base">
            {equipment.type} | {equipment.model}
          </SheetDescription>
        </div>
        <EquipmentExportService equipment={equipment} />
      </div>
    </SheetHeader>
  );
}
