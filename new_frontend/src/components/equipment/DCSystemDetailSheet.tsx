
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getDCSystem, calculateTotalInstalledCapacity, calculateTotalBatteryCapacity, calculateAutonomy } from "@/lib/dcSystemService";
import { DCSystem } from "@/types/dcSystem";
import { Zap, Battery, Network, CircuitBoard, MapPin, Server, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DCSystemEditDialog } from "./DCSystemEditDialog";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DCSystemDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function DCSystemDetailSheet({ open, onOpenChange, onUpdate }: DCSystemDetailSheetProps) {
  const [system, setSystem] = useState<DCSystem>(getDCSystem());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // Re-fetch system data when the sheet is opened or when updates happen
  useEffect(() => {
    if (open) {
      setSystem(getDCSystem());
    }
  }, [open, editDialogOpen]);
  
  const totalCapacity = calculateTotalInstalledCapacity(system);
  const totalBatteryAh = calculateTotalBatteryCapacity(system);
  const autonomyHours = calculateAutonomy(system);

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
  
  // Group rectifiers by model
  const rectifierModels = system.rectifiers.reduce((acc, rectifier) => {
    const existingGroup = acc.find(group => group.name === rectifier.name);
    if (existingGroup) {
      existingGroup.count += 1;
      existingGroup.totalCapacity += rectifier.capacity;
    } else {
      acc.push({
        name: rectifier.name,
        count: 1,
        capacity: rectifier.capacity,
        totalCapacity: rectifier.capacity
      });
    }
    return acc;
  }, [] as { name: string; count: number; capacity: number; totalCapacity: number }[]);

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleSystemUpdate = () => {
    setSystem(getDCSystem());
    onUpdate();
  };

  const handleGoToDCSystem = () => {
    onOpenChange(false); // Close the sheet first
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
            {/* Location Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Emplacement
              </h3>
              <p className="text-sm">{system.location}</p>
              <p className="text-sm text-muted-foreground">Modèle: {system.model}</p>
            </div>
            
            <Separator />
            
            {/* System Overview */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" /> Aperçu du système
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                <Card className="bg-blue-50">
                  <CardHeader className="py-2">
                    <CardTitle className="text-xs font-medium">Capacité</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-blue-600" />
                      <div className="text-xl font-semibold">{totalCapacity} W</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50">
                  <CardHeader className="py-2">
                    <CardTitle className="text-xs font-medium">Autonomie</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex items-center space-x-1">
                      <Battery className="h-3 w-3 text-green-600" />
                      <div className="text-xl font-semibold">{autonomyHours.toFixed(1)} h</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-orange-50">
                  <CardHeader className="py-2">
                    <CardTitle className="text-xs font-medium">Tension</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-orange-600" />
                      <div className="text-xl font-semibold">{system.systemVoltage} V</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50">
                  <CardHeader className="py-2">
                    <CardTitle className="text-xs font-medium">Charge</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-purple-600" />
                      <div className="text-xl font-semibold">{system.totalLoad} W</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Separator />
            
            {/* Rectifiers */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" /> Redresseurs
              </h3>
              
              {rectifierModels.length > 0 ? (
                <ul className="space-y-1">
                  {rectifierModels.map((model, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{model.name}</span>
                      <span>{model.count} × {model.capacity}W = {model.totalCapacity}W</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun redresseur installé</p>
              )}
            </div>
            
            {/* CBDBs */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <CircuitBoard className="h-4 w-4" /> CBDB
              </h3>
              
              {system.cdbds.length > 0 ? (
                <ul className="space-y-1">
                  {system.cdbds.map(cbdb => (
                    <li key={cbdb.id} className="flex justify-between text-sm">
                      <span>{cbdb.name}</span>
                      <span>{cbdb.capacityAmp}A, {cbdb.fuseCount} fusibles</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun CBDB installé</p>
              )}
            </div>
            
            {/* Battery Packs */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Battery className="h-4 w-4" /> Batteries
              </h3>
              
              {system.batteryPacks.length > 0 ? (
                <ul className="space-y-1">
                  {system.batteryPacks.map(battery => (
                    <li key={battery.id} className="flex flex-col space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{battery.name}</span>
                        <span>{battery.capacityAh}Ah ({battery.type})</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pl-2">
                        <span>NB accumulateur: {battery.cellCount || 'N/A'}</span>
                        <span>Âge: {calculateBatteryAge(battery.manufactureDate)}</span>
                        {battery.lastInspectionDate && (
                          <span>Dernière inspection: {new Date(battery.lastInspectionDate).toLocaleDateString('fr-CA')}</span>
                        )}
                        {battery.nextInspectionDate && (
                          <span>Prochaine inspection: {new Date(battery.nextInspectionDate).toLocaleDateString('fr-CA')}</span>
                        )}
                        {battery.rating && <span>Côte: {battery.rating}/10</span>}
                      </div>
                    </li>
                  ))}
                  <li className="flex justify-between text-sm font-medium mt-1">
                    <span>Capacité totale</span>
                    <span>{totalBatteryAh}Ah</span>
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune batterie installée</p>
              )}
            </div>
            
            <Separator />
            
            {/* Network Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Network className="h-4 w-4" /> Information réseau
              </h3>
              
              {system.networkInfo ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Adresse IP:</span>
                  </div>
                  <div className="text-sm">{system.networkInfo.ipAddress || "Non configurée"}</div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Masque:</span>
                  </div>
                  <div className="text-sm">{system.networkInfo.subnetMask || "Non configurée"}</div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Passerelle:</span>
                  </div>
                  <div className="text-sm">{system.networkInfo.gateway || "Non configurée"}</div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Port:</span>
                  </div>
                  <div className="text-sm">{system.networkInfo.switchPort || "Non configuré"}</div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune information réseau configurée</p>
              )}
            </div>
            
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
