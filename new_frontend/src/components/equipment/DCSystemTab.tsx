
import React from "react";
import { Button } from "@/components/ui/button";
import { DCSystem } from "@/types/dcSystem";
import { calculateTotalInstalledCapacity, calculateAutonomy } from "@/lib/dcSystemService";
import CustomizableTable from "@/components/equipment/CustomizableTable";
import { getColumnsByType } from "@/lib/equipmentColumns";
import { Edit, MoreHorizontal, Network, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DCSystemTabProps {
  dcSystem: DCSystem;
  onEditSystem: () => void;
  onSystemClick: () => void;
  onGoToDCSystem?: () => void;
}

export const DCSystemTab = ({ 
  dcSystem, 
  onEditSystem, 
  onSystemClick,
  onGoToDCSystem
}: DCSystemTabProps) => {
  const navigate = useNavigate();

  const calculateTotalInstalledCapacityValue = (system: DCSystem): number => {
    return calculateTotalInstalledCapacity(system);
  };

  // Function that was previously defined in Equipment.tsx
  const calculateAutonomyValue = (system: DCSystem): number => {
    // Using the imported function from dcSystemService
    return calculateAutonomy(system);
  };

  const handleGoToDCSystem = () => {
    if (onGoToDCSystem) {
      onGoToDCSystem();
    } else {
      navigate('/dc-system');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Systèmes DC</h3>
        <Button onClick={onEditSystem}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier le système
        </Button>
      </div>
      
      <CustomizableTable
        data={[{
          id: dcSystem.id,
          name: dcSystem.name,
          systemVoltage: dcSystem.systemVoltage,
          baseCapacity: calculateTotalInstalledCapacityValue(dcSystem),
          networkInfo: dcSystem.networkInfo,
          autonomy: calculateAutonomyValue(dcSystem)
        }]}
        defaultColumns={getColumnsByType("dc")}
        equipmentType="dc"
        onRowClick={onSystemClick}
        actionMenu={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditSystem}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGoToDCSystem}>
                <Server className="mr-2 h-4 w-4" />
                <span>Gérer les composants</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Network className="mr-2 h-4 w-4" />
                <span>Configuration réseau</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
  );
};
