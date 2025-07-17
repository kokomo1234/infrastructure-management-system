import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getDCSystem } from "@/lib/dcSystemService";
import { DCSystem } from "@/types/dcSystem";
import { useNavigate } from "react-router-dom";
import { DCSystemEditDialog } from "../DCSystemEditDialog";
import { SystemOverview } from "./SystemOverview";
import { LocationInfo } from "./LocationInfo";
import { RectifiersSection } from "./RectifiersSection";
import { CBDBSection } from "./CBDBSection";
import { BatterySection } from "./BatterySection";
import { NetworkSection } from "./NetworkSection";
import { Separator } from "@/components/ui/separator";
import { Server } from "lucide-react";

interface DCSystemDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function DCSystemDetailSheet({ open, onOpenChange, onUpdate }: DCSystemDetailSheetProps) {
  const [system, setSystem] = useState<DCSystem>(getDCSystem());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (open) {
      setSystem(getDCSystem());
    }
  }, [open, editDialogOpen]);

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleSystemUpdate = () => {
    setSystem(getDCSystem());
    onUpdate();
  };

  const handleGoToDCSystem = () => {
    onOpenChange(false);
    navigate('/dc-system');
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-5">
            <SheetTitle className="text-2xl flex items-center gap-2">
              <Server className="h-6 w-6" /> 
              {system.name}
            </SheetTitle>
            <SheetDescription>
              Détails du système d'alimentation DC
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6">
            <LocationInfo system={system} />
            
            <Separator />
            
            <SystemOverview system={system} />
            
            <Separator />
            
            <RectifiersSection system={system} />
            
            <CBDBSection system={system} />
            
            <BatterySection system={system} />
            
            <Separator />
            
            <NetworkSection system={system} />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={handleGoToDCSystem}
              >
                Gérer les composants
              </Button>
              <Button onClick={handleEditDialogOpen}>
                Modifier le système
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <DCSystemEditDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        onUpdate={handleSystemUpdate} 
      />
    </>
  );
}
