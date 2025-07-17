
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateDCSystem, updateNetworkInfo, getDCSystem } from "@/lib/dcSystemService";
import { DCSystem, NetworkInfo } from "@/types/dcSystem";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Network, Zap } from "lucide-react";

interface DCSystemEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function DCSystemEditDialog({ open, onOpenChange, onUpdate }: DCSystemEditDialogProps) {
  const system = getDCSystem();
  
  const [name, setName] = useState(system.name || "");
  const [model, setModel] = useState(system.model || "");
  const [location, setLocation] = useState(system.location || "");
  const [baseCapacity, setBaseCapacity] = useState(system.baseCapacity?.toString() || "0");
  const [systemVoltage, setSystemVoltage] = useState(system.systemVoltage?.toString() || "48");
  const [totalLoad, setTotalLoad] = useState(system.totalLoad?.toString() || "0");
  
  // Network Information
  const [ipAddress, setIpAddress] = useState(system.networkInfo?.ipAddress || "");
  const [subnetMask, setSubnetMask] = useState(system.networkInfo?.subnetMask || "");
  const [gateway, setGateway] = useState(system.networkInfo?.gateway || "");
  const [switchPort, setSwitchPort] = useState(system.networkInfo?.switchPort || "");

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      const currentSystem = getDCSystem();
      setName(currentSystem.name || "");
      setModel(currentSystem.model || "");
      setLocation(currentSystem.location || "");
      setBaseCapacity(currentSystem.baseCapacity?.toString() || "0");
      setSystemVoltage(currentSystem.systemVoltage?.toString() || "48");
      setTotalLoad(currentSystem.totalLoad?.toString() || "0");
      
      setIpAddress(currentSystem.networkInfo?.ipAddress || "");
      setSubnetMask(currentSystem.networkInfo?.subnetMask || "");
      setGateway(currentSystem.networkInfo?.gateway || "");
      setSwitchPort(currentSystem.networkInfo?.switchPort || "");
    }
  }, [open]);

  const handleSave = () => {
    try {
      // Update system information
      updateDCSystem({
        name,
        model,
        location,
        baseCapacity: parseFloat(baseCapacity) || 0,
        systemVoltage: parseFloat(systemVoltage) || 48,
        totalLoad: parseFloat(totalLoad) || 0
      });
      
      // Update network information
      if (ipAddress || subnetMask || gateway || switchPort) {
        const networkInfo: NetworkInfo = {
          ipAddress,
          subnetMask,
          gateway,
          switchPort
        };
        updateNetworkInfo(networkInfo);
      }
      
      onUpdate();
      onOpenChange(false);
      toast.success("Système DC mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du système");
      console.error(error);
    }
  };

  const locationOptions = [
    { id: "montreal", name: "Centrale Montréal" },
    { id: "quebec", name: "Station Québec" },
    { id: "sherbrooke", name: "Centre Sherbrooke" },
    { id: "gatineau", name: "Poste Gatineau" },
    { id: "laval", name: "Installation Laval" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Modifier le système DC</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations du système d'alimentation DC
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="system" className="mt-2">
          <TabsList className="mb-4">
            <TabsTrigger value="system">
              <Server className="h-4 w-4 mr-2" />
              Système
            </TabsTrigger>
            <TabsTrigger value="network">
              <Network className="h-4 w-4 mr-2" />
              Réseau
            </TabsTrigger>
            <TabsTrigger value="power">
              <Zap className="h-4 w-4 mr-2" />
              Alimentation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du système</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Modèle</Label>
                <Input 
                  id="model" 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Emplacement</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un site" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map(option => (
                    <SelectItem key={option.id} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="network" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ip-address">Adresse IP</Label>
                <Input 
                  id="ip-address" 
                  value={ipAddress} 
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="192.168.1.100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subnet-mask">Masque de sous-réseau</Label>
                <Input 
                  id="subnet-mask" 
                  value={subnetMask} 
                  onChange={(e) => setSubnetMask(e.target.value)}
                  placeholder="255.255.255.0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gateway">Passerelle</Label>
                <Input 
                  id="gateway" 
                  value={gateway} 
                  onChange={(e) => setGateway(e.target.value)}
                  placeholder="192.168.1.1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="switch-port">Port du commutateur</Label>
                <Input 
                  id="switch-port" 
                  value={switchPort} 
                  onChange={(e) => setSwitchPort(e.target.value)}
                  placeholder="GigabitEthernet1/0/1"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="power" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base-capacity">Capacité de base (W)</Label>
                <Input 
                  id="base-capacity" 
                  type="number" 
                  value={baseCapacity} 
                  onChange={(e) => setBaseCapacity(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="system-voltage">Tension du système (V)</Label>
                <Input 
                  id="system-voltage" 
                  type="number" 
                  value={systemVoltage} 
                  onChange={(e) => setSystemVoltage(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total-load">Charge totale (W)</Label>
              <Input 
                id="total-load" 
                type="number" 
                value={totalLoad} 
                onChange={(e) => setTotalLoad(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Utilisé pour calculer l'autonomie du système
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
