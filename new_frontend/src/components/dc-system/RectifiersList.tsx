
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDCSystem, addRectifier, removeRectifier, calculateTotalInstalledCapacity } from "@/lib/dcSystemService";
import { toast } from "sonner";
import { Zap, Plus, Trash } from "lucide-react";

interface RectifiersListProps {
  onComponentChange: () => void;
}

export function RectifiersList({ onComponentChange }: RectifiersListProps) {
  const system = getDCSystem();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  
  const totalCapacity = calculateTotalInstalledCapacity(system);
  const rectifiersCapacity = totalCapacity - system.baseCapacity;

  const handleAddRectifier = () => {
    if (!name || !capacity) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      addRectifier({
        name,
        capacity: parseFloat(capacity) || 0
      });
      
      setName("");
      setCapacity("");
      onComponentChange();
      toast.success("Redresseur ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du redresseur");
      console.error(error);
    }
  };

  const handleRemoveRectifier = (id: string) => {
    try {
      removeRectifier(id);
      onComponentChange();
      toast.success("Redresseur supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du redresseur");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redresseurs</CardTitle>
        <CardDescription>
          Gestion des redresseurs du système DC. 
          Capacité totale des redresseurs: {rectifiersCapacity}W
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {system.rectifiers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Capacité (W)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {system.rectifiers.map((rectifier) => (
                <TableRow key={rectifier.id}>
                  <TableCell>{rectifier.name}</TableCell>
                  <TableCell>{rectifier.capacity}W</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRectifier(rectifier.id)}
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
            <Zap className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">Aucun redresseur ajouté</p>
          </div>
        )}
        
        <div className="border rounded-md p-4 space-y-4 mt-4">
          <h3 className="font-medium">Ajouter un redresseur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rectifier-name">Nom</Label>
              <Input 
                id="rectifier-name" 
                placeholder="ex: Redresseur 1000W" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rectifier-capacity">Capacité (W)</Label>
              <Input 
                id="rectifier-capacity" 
                type="number" 
                placeholder="ex: 1000" 
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAddRectifier} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
