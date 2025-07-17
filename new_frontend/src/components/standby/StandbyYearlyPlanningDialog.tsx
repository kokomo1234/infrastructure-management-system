
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { standbyPeople, randomlyAssignStandby } from "@/lib/standbyService";
import { exportStandbyToCSV, exportStandbyToPDF } from "@/lib/standbyExportService";
import { Download, FileText, Users, Calendar as CalendarIcon } from "lucide-react";

interface StandbyYearlyPlanningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StandbyYearlyPlanningDialog({ open, onOpenChange }: StandbyYearlyPlanningDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [numberOfWeeks, setNumberOfWeeks] = useState<number>(52);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handlePersonToggle = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };
  
  const handleGeneratePlanning = async () => {
    if (!startDate || selectedPeople.length === 0) {
      toast("Information manquante", {
        description: "Veuillez sélectionner une date de début et au moins une personne.",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const assignments = randomlyAssignStandby(selectedPeople, startDate, numberOfWeeks);
      
      toast.success("Planification générée", {
        description: `${assignments.length} semaines de garde ont été planifiées automatiquement.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la génération de la planification.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const weeksPerPerson = selectedPeople.length > 0 ? Math.floor(numberOfWeeks / selectedPeople.length) : 0;
  const remainingWeeks = selectedPeople.length > 0 ? numberOfWeeks % selectedPeople.length : 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Planification annuelle automatique
          </DialogTitle>
          <DialogDescription>
            Générez automatiquement le planning de garde pour toute une année en répartissant équitablement les semaines entre les utilisateurs sélectionnés.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Date de début (vendredi)</Label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="weeks" className="text-sm font-medium mb-2 block">
                  Nombre de semaines
                </Label>
                <Input
                  id="weeks"
                  type="number"
                  min="1"
                  max="53"
                  value={numberOfWeeks}
                  onChange={(e) => setNumberOfWeeks(parseInt(e.target.value) || 52)}
                />
              </div>
              
              {selectedPeople.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Répartition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Total semaines :</span>
                        <span className="font-medium">{numberOfWeeks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Personnes sélectionnées :</span>
                        <span className="font-medium">{selectedPeople.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Semaines par personne :</span>
                        <span className="font-medium">{weeksPerPerson}</span>
                      </div>
                      {remainingWeeks > 0 && (
                        <div className="flex justify-between text-amber-600">
                          <span>Semaines supplémentaires :</span>
                          <span className="font-medium">{remainingWeeks}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
              <Users className="h-4 w-4" />
              Sélectionner les personnes ({selectedPeople.length} sélectionnée(s))
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded-lg p-3">
              {standbyPeople.map(person => (
                <div key={person.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={person.id}
                    checked={selectedPeople.includes(person.id)}
                    onCheckedChange={() => handlePersonToggle(person.id)}
                  />
                  <label htmlFor={person.id} className="text-sm font-medium cursor-pointer flex-1">
                    {person.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-800 dark:text-blue-200">
                Comment ça fonctionne
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p>• Les gardes commencent le vendredi à 16h et se terminent le vendredi suivant à 7h</p>
              <p>• La répartition se fait automatiquement et équitablement</p>
              <p>• Les semaines supplémentaires sont distribuées aléatoirement</p>
              <p>• Chaque personne sélectionnée recevra une notification</p>
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportStandbyToCSV} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportStandbyToPDF} className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button 
            onClick={handleGeneratePlanning} 
            disabled={isGenerating || selectedPeople.length === 0 || !startDate}
          >
            {isGenerating ? "Génération..." : "Générer la planification"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
