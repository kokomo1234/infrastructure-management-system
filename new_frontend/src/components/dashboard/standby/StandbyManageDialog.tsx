
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { standbyPeople, createDailyAssignment, createWeeklyAssignment } from "@/lib/standbyService";

interface StandbyManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StandbyManageDialog({ open, onOpenChange }: StandbyManageDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("daily");
  
  const handleAssign = () => {
    if (!selectedPerson || !date) {
      toast("Information manquante", {
        description: "Veuillez sélectionner une personne et une date.",
      });
      return;
    }
    
    if (selectedTab === "daily") {
      // Create daily assignment for selected date and person
      createDailyAssignment(selectedPerson, date);
      
      toast("Affectation journalière mise à jour", {
        description: `${standbyPeople.find(p => p.id === selectedPerson)?.name} a été affecté à la garde pour le ${format(date, "P", { locale: fr })}.`,
      });
    } else {
      // Create weekly assignment (starting Friday)
      createWeeklyAssignment(selectedPerson, date);
      
      toast("Affectation hebdomadaire mise à jour", {
        description: `${standbyPeople.find(p => p.id === selectedPerson)?.name} a été affecté à la garde pour la semaine du ${format(date, "P", { locale: fr })}.`,
      });
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gérer le planning de garde</DialogTitle>
          <DialogDescription>
            En tant qu'administrateur, vous pouvez affecter des gardes journalières ou hebdomadaires.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="daily" onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Garde journalière</TabsTrigger>
            <TabsTrigger value="weekly">Garde hebdomadaire</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date de garde</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border pointer-events-auto"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Personne de garde</label>
              <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une personne" />
                </SelectTrigger>
                <SelectContent>
                  {standbyPeople.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Semaine de début (vendredi)</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border pointer-events-auto"
              />
              <p className="text-xs text-muted-foreground mt-2">La garde commence le vendredi à 16h et se termine le jeudi suivant à 16h.</p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Personne de garde</label>
              <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une personne" />
                </SelectTrigger>
                <SelectContent>
                  {standbyPeople.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleAssign}>Affecter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
