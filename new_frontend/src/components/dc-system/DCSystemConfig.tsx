
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getDCSystem, updateDCSystem } from "@/lib/dcSystemService";
import { toast } from "sonner";

interface DCSystemConfigProps {
  onComponentChange: () => void;
}

export function DCSystemConfig({ onComponentChange }: DCSystemConfigProps) {
  const system = getDCSystem();
  
  const [name, setName] = useState(system.name);
  const [baseCapacity, setBaseCapacity] = useState(system.baseCapacity.toString());
  const [systemVoltage, setSystemVoltage] = useState(system.systemVoltage.toString());
  const [totalLoad, setTotalLoad] = useState(system.totalLoad.toString());

  const handleSave = () => {
    try {
      updateDCSystem({
        name,
        baseCapacity: parseFloat(baseCapacity) || 0,
        systemVoltage: parseFloat(systemVoltage) || 48,
        totalLoad: parseFloat(totalLoad) || 0
      });
      
      onComponentChange();
      toast.success("Configuration du système mise à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la configuration");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration du système DC</CardTitle>
        <CardDescription>Paramètres généraux du système d'alimentation DC</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="system-name">Nom du système</Label>
          <Input 
            id="system-name" 
            placeholder="Nom du système" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="base-capacity">Capacité de base (W)</Label>
          <Input 
            id="base-capacity" 
            type="number" 
            placeholder="Capacité en Watts" 
            value={baseCapacity} 
            onChange={(e) => setBaseCapacity(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Capacité initiale sans compter les redresseurs
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="system-voltage">Tension du système (V)</Label>
          <Input 
            id="system-voltage" 
            type="number" 
            placeholder="Tension en Volts" 
            value={systemVoltage} 
            onChange={(e) => setSystemVoltage(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Utilisé pour calculer la puissance des CBDB et l'autonomie
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="total-load">Charge totale (W)</Label>
          <Input 
            id="total-load" 
            type="number" 
            placeholder="Charge en Watts" 
            value={totalLoad} 
            onChange={(e) => setTotalLoad(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Utilisé pour calculer l'autonomie du système
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Enregistrer la configuration</Button>
      </CardFooter>
    </Card>
  );
}
