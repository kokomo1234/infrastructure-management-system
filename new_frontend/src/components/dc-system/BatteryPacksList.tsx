
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDCSystem, addBatteryPack, removeBatteryPack, calculateTotalBatteryCapacity } from "@/lib/dcSystemService";
import { toast } from "sonner";
import { Battery, Plus, Trash, Calendar, Thermometer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface BatteryPacksListProps {
  onComponentChange: () => void;
}

export function BatteryPacksList({ onComponentChange }: BatteryPacksListProps) {
  const system = getDCSystem();
  const [name, setName] = useState("");
  const [type, setType] = useState<"lithium-ion" | "lead-acid" | "other">("lithium-ion");
  const [capacityAh, setCapacityAh] = useState("");
  const [cellCount, setCellCount] = useState("4");
  const [manufactureDate, setManufactureDate] = useState("");
  const [rechargeCurrent, setRechargeCurrent] = useState("");
  const [standardResistance, setStandardResistance] = useState("");
  const [lastInspectionDate, setLastInspectionDate] = useState("");
  const [nextInspectionDate, setNextInspectionDate] = useState("");
  const [rating, setRating] = useState("10");
  const [comments, setComments] = useState("");
  
  const totalBatteryAh = calculateTotalBatteryCapacity(system);

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

  const handleAddBatteryPack = () => {
    if (!name || !capacityAh) {
      toast.error("Veuillez remplir au moins le nom et la capacité");
      return;
    }
    
    try {
      addBatteryPack({
        name,
        type,
        capacityAh: parseFloat(capacityAh) || 0,
        systemId: system.id,
        cellCount: parseInt(cellCount) || 4,
        manufactureDate: manufactureDate || undefined,
        rechargeCurrent: rechargeCurrent ? parseFloat(rechargeCurrent) : undefined,
        standardResistance: standardResistance ? parseFloat(standardResistance) : undefined,
        lastInspectionDate: lastInspectionDate || undefined,
        nextInspectionDate: nextInspectionDate || undefined,
        rating: rating ? parseInt(rating) : undefined,
        comments: comments || undefined
      });
      
      // Reset form fields
      setName("");
      setCapacityAh("");
      setCellCount("4");
      setManufactureDate("");
      setRechargeCurrent("");
      setStandardResistance("");
      setLastInspectionDate("");
      setNextInspectionDate("");
      setRating("10");
      setComments("");
      
      onComponentChange();
      toast.success("Pack de batteries ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du pack de batteries");
      console.error(error);
    }
  };

  const handleRemoveBatteryPack = (id: string) => {
    try {
      removeBatteryPack(id);
      onComponentChange();
      toast.success("Pack de batteries supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du pack de batteries");
      console.error(error);
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch(type) {
      case "lithium-ion": return "Lithium-ion";
      case "lead-acid": return "Plomb-acide";
      case "other": return "Autre";
      default: return type;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Packs de Batteries</CardTitle>
        <CardDescription>
          Gestion des packs de batteries. 
          Capacité totale: {totalBatteryAh}Ah
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Liste des batteries</TabsTrigger>
            <TabsTrigger value="details">Détails techniques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            {system.batteryPacks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacité (Ah)</TableHead>
                    <TableHead>NB accumulateur</TableHead>
                    <TableHead>Âge</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {system.batteryPacks.map((batteryPack) => (
                    <TableRow key={batteryPack.id}>
                      <TableCell>{batteryPack.name}</TableCell>
                      <TableCell>{getTypeLabel(batteryPack.type)}</TableCell>
                      <TableCell>{batteryPack.capacityAh}Ah</TableCell>
                      <TableCell>{batteryPack.cellCount || 'N/A'}</TableCell>
                      <TableCell>{calculateBatteryAge(batteryPack.manufactureDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBatteryPack(batteryPack.id)}
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
                <Battery className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground">Aucun pack de batteries ajouté</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            {system.batteryPacks.length > 0 ? (
              <div className="space-y-4">
                {system.batteryPacks.map((batteryPack) => (
                  <Card key={batteryPack.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 py-3">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{batteryPack.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBatteryPack(batteryPack.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Spécifications</h4>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span>{getTypeLabel(batteryPack.type)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Capacité:</span>
                              <span>{batteryPack.capacityAh}Ah</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">NB accumulateur:</span>
                              <span>{batteryPack.cellCount || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Courant de recharge:</span>
                              <span>{batteryPack.rechargeCurrent ? `${batteryPack.rechargeCurrent}A` : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Résistance étalon:</span>
                              <span>{batteryPack.standardResistance || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Côte:</span>
                              <span>{batteryPack.rating || 'N/A'}/10</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Dates</h4>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date de fabrication:</span>
                              <span>{formatDate(batteryPack.manufactureDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Âge:</span>
                              <span>{calculateBatteryAge(batteryPack.manufactureDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Dernière inspection:</span>
                              <span>{formatDate(batteryPack.lastInspectionDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Prochaine inspection:</span>
                              <span>{formatDate(batteryPack.nextInspectionDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {batteryPack.comments && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-1">Commentaires</h4>
                          <p className="text-sm bg-gray-50 p-2 rounded">{batteryPack.comments}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border rounded-md bg-gray-50">
                <Battery className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground">Aucun pack de batteries ajouté</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="border rounded-md p-4 space-y-4 mt-4">
          <h3 className="font-medium">Ajouter un pack de batteries</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="battery-name">Nom</Label>
              <Input 
                id="battery-name" 
                placeholder="ex: Pack Li-ion 200Ah" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="battery-type">Type</Label>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as "lithium-ion" | "lead-acid" | "other")}
              >
                <SelectTrigger id="battery-type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lithium-ion">Lithium-ion</SelectItem>
                  <SelectItem value="lead-acid">Plomb-acide</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity-ah">Capacité (Ah)</Label>
              <Input 
                id="capacity-ah" 
                type="number" 
                placeholder="ex: 200" 
                value={capacityAh} 
                onChange={(e) => setCapacityAh(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cell-count">NB accumulateur</Label>
              <Input 
                id="cell-count" 
                type="number" 
                placeholder="ex: 4" 
                value={cellCount} 
                onChange={(e) => setCellCount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacture-date">Date de fabrication</Label>
              <Input 
                id="manufacture-date" 
                type="date" 
                value={manufactureDate} 
                onChange={(e) => setManufactureDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recharge-current">Courant de recharge (A)</Label>
              <Input 
                id="recharge-current" 
                type="number" 
                step="0.1"
                placeholder="ex: 10" 
                value={rechargeCurrent} 
                onChange={(e) => setRechargeCurrent(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="standard-resistance">Résistance étalon</Label>
              <Input 
                id="standard-resistance" 
                type="number" 
                step="0.001"
                placeholder="ex: 0.005" 
                value={standardResistance} 
                onChange={(e) => setStandardResistance(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last-inspection">Dernière inspection</Label>
              <Input 
                id="last-inspection" 
                type="date" 
                value={lastInspectionDate} 
                onChange={(e) => setLastInspectionDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="next-inspection">Prochaine inspection</Label>
              <Input 
                id="next-inspection" 
                type="date" 
                value={nextInspectionDate} 
                onChange={(e) => setNextInspectionDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Côte (1-10)</Label>
              <Select 
                value={rating} 
                onValueChange={setRating}
              >
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Sélectionner une côte" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comments">Commentaires</Label>
              <Input 
                id="comments" 
                placeholder="Commentaires ou notes sur ce pack de batteries" 
                value={comments} 
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleAddBatteryPack} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
