
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { StandbyPerson } from "@/types/standby";
import { standbyPeople, requestStandbyChange } from "@/lib/standbyService";

interface StandbyRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPerson: StandbyPerson;
}

export function StandbyRequestDialog({ open, onOpenChange, currentPerson }: StandbyRequestDialogProps) {
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [message, setMessage] = useState<string>("");
  const [requestType, setRequestType] = useState<"day" | "week">("day");
  
  const handleRequest = () => {
    if (!selectedPerson || !selectedDate) {
      toast.error("Information manquante", {
        description: "Veuillez sélectionner une personne et une date.",
      });
      return;
    }
    
    let startDate: Date, endDate: Date;
    
    if (requestType === "day") {
      startDate = new Date(selectedDate);
      startDate.setHours(16, 0, 0, 0);
      
      endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(7, 0, 0, 0);
    } else {
      // Find the closest Friday
      startDate = new Date(selectedDate);
      while (startDate.getDay() !== 5) { // 5 is Friday
        startDate.setDate(startDate.getDate() - 1);
      }
      startDate.setHours(16, 0, 0, 0);
      
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
      endDate.setHours(7, 0, 0, 0);
    }
    
    requestStandbyChange(currentPerson.id, selectedPerson, startDate, endDate, message);
    
    toast.success("Demande envoyée", {
      description: requestType === "day" 
        ? `Une demande de remplacement a été envoyée pour le ${format(selectedDate, "P", { locale: fr })}.`
        : `Une demande de remplacement a été envoyée pour la semaine du ${format(startDate, "P", { locale: fr })}.`
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Demander un remplacement</DialogTitle>
          <DialogDescription>
            Sélectionnez une personne pour vous remplacer pendant votre garde
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="day" onValueChange={(value) => setRequestType(value as "day" | "week")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="day">Journée</TabsTrigger>
            <TabsTrigger value="week">Semaine complète</TabsTrigger>
          </TabsList>
          
          <TabsContent value="day" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date à remplacer</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border pointer-events-auto"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Semaine à remplacer</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border pointer-events-auto"
              />
              <p className="text-xs text-muted-foreground mt-2">
                La demande sera pour la semaine complète (du vendredi 16h au vendredi suivant 7h)
              </p>
            </div>
          </TabsContent>
          
          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">Personne de remplacement</label>
            <Select value={selectedPerson} onValueChange={setSelectedPerson}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une personne" />
              </SelectTrigger>
              <SelectContent>
                {standbyPeople
                  .filter(person => person.id !== currentPerson.id)
                  .map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">Message (optionnel)</label>
            <Textarea
              placeholder="Expliquez pourquoi vous demandez un remplacement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </Tabs>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleRequest}>Envoyer la demande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
