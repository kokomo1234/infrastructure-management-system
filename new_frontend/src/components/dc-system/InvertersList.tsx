
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDCSystem, addInverter, removeInverter } from "@/lib/dcSystemService";
import { toast } from "sonner";
import { PlugZap, Plus, Trash } from "lucide-react";

interface InvertersListProps {
  onComponentChange: () => void;
}

export function InvertersList({ onComponentChange }: InvertersListProps) {
  const system = getDCSystem();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [efficiency, setEfficiency] = useState("");
  
  const totalInverterCapacity = system.inverters.reduce((sum, inv) => sum + inv.capacity, 0);

  const handleAddInverter = () => {
    if (!name || !capacity) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    
    try {
      addInverter({
        name,
        capacity: parseFloat(capacity) || 0,
        efficiency: efficiency ? parseFloat(efficiency) : undefined,
        systemId: system.id // Associate with the current system
      });
      
      setName("");
      setCapacity("");
      setEfficiency("");
      onComponentChange();
      toast.success("Onduleur ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'onduleur");
      console.error(error);
    }
  };

  const handleRemoveInverter = (id: string) => {
    try {
      removeInverter(id);
      onComponentChange();
      toast.success("Onduleur supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'onduleur");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Onduleurs (DC vers AC)</CardTitle>
        <CardDescription>
          Gestion des onduleurs pour conversion DC vers AC. 
          Capacité totale: {totalInverterCapacity}W
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {system.inverters.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Capacité (W)</TableHead>
                <TableHead>Efficacité</TableHead>
                <TableHead>Système DC</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {system.inverters.map((inverter) => (
                <TableRow key={inverter.id}>
                  <TableCell>{inverter.name}</TableCell>
                  <TableCell>{inverter.capacity}W</TableCell>
                  <TableCell>{inverter.efficiency ? `${inverter.efficiency}%` : "N/A"}</TableCell>
                  <TableCell>{system.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveInverter(inverter.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4 border rounded-md bg-gray-50">
            <PlugZap className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">Aucun onduleur ajouté</p>
          </div>
        )}
        
        <div className="border rounded-md p-4 space-y-4 mt-4">
          <h3 className="font-medium">Ajouter un onduleur</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inverter-name">Nom</Label>
              <Input 
                id="inverter-name" 
                placeholder="ex: Onduleur 5000W" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inverter-capacity">Capacité (W)</Label>
              <Input 
                id="inverter-capacity" 
                type="number" 
                placeholder="ex: 5000" 
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inverter-efficiency">Efficacité (%)</Label>
              <Input 
                id="inverter-efficiency" 
                type="number" 
                placeholder="ex: 95 (optionnel)" 
                value={efficiency} 
                onChange={(e) => setEfficiency(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAddInverter} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
