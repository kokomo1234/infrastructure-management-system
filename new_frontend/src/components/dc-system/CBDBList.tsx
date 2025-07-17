
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDCSystem, addCBDB, removeCBDB, calculateCBDBWattage } from "@/lib/dcSystemService";
import { toast } from "sonner";
import { CircuitBoard, Plus, Trash } from "lucide-react";

interface CBDBListProps {
  onComponentChange: () => void;
}

export function CBDBList({ onComponentChange }: CBDBListProps) {
  const system = getDCSystem();
  const [name, setName] = useState("");
  const [fuseCount, setFuseCount] = useState("");
  const [capacityAmp, setCapacityAmp] = useState("");

  const handleAddCBDB = () => {
    if (!name || !fuseCount || !capacityAmp) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      addCBDB({
        name,
        fuseCount: parseInt(fuseCount) || 0,
        capacityAmp: parseFloat(capacityAmp) || 0
      });
      
      setName("");
      setFuseCount("");
      setCapacityAmp("");
      onComponentChange();
      toast.success("CBDB ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du CBDB");
      console.error(error);
    }
  };

  const handleRemoveCBDB = (id: string) => {
    try {
      removeCBDB(id);
      onComponentChange();
      toast.success("CBDB supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du CBDB");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tableaux de Distribution (CBDB)</CardTitle>
        <CardDescription>
          Gestion des tableaux de distribution avec disjoncteurs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {system.cdbds.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Nombre de fusibles</TableHead>
                <TableHead>Capacité (A)</TableHead>
                <TableHead>Puissance (W)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {system.cdbds.map((cbdb) => (
                <TableRow key={cbdb.id}>
                  <TableCell>{cbdb.name}</TableCell>
                  <TableCell>{cbdb.fuseCount}</TableCell>
                  <TableCell>{cbdb.capacityAmp}A</TableCell>
                  <TableCell>{calculateCBDBWattage(cbdb, system.systemVoltage)}W</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCBDB(cbdb.id)}
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
            <CircuitBoard className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">Aucun CBDB ajouté</p>
          </div>
        )}
        
        <div className="border rounded-md p-4 space-y-4 mt-4">
          <h3 className="font-medium">Ajouter un CBDB</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cbdb-name">Nom</Label>
              <Input 
                id="cbdb-name" 
                placeholder="ex: CBDB-1" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuse-count">Nombre de fusibles</Label>
              <Input 
                id="fuse-count" 
                type="number" 
                placeholder="ex: 10" 
                value={fuseCount} 
                onChange={(e) => setFuseCount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity-amp">Capacité (A)</Label>
              <Input 
                id="capacity-amp" 
                type="number" 
                placeholder="ex: 100" 
                value={capacityAmp} 
                onChange={(e) => setCapacityAmp(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAddCBDB} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
