
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { standbyPeople, updateStandbyAssignment, createDailyAssignment } from "@/lib/standbyService";

interface StandbyAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAssignmentId: string | null;
  selectedPersonId: string;
  setSelectedPersonId: (personId: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export function StandbyAssignDialog({
  open,
  onOpenChange,
  selectedAssignmentId,
  selectedPersonId,
  setSelectedPersonId,
  selectedDate,
  setSelectedDate
}: StandbyAssignDialogProps) {
  const handleAssign = () => {
    if (!selectedPersonId || !selectedAssignmentId) {
      toast("Information manquante", {
        description: "Veuillez sélectionner une personne et une période de garde."
      });
      return;
    }
    
    updateStandbyAssignment(selectedAssignmentId, selectedPersonId);
    
    toast("Garde mise à jour", {
      description: `${standbyPeople.find(p => p.id === selectedPersonId)?.name} a été affecté à la garde sélectionnée.`
    });
    
    onOpenChange(false);
  };

  const handleAssignDay = () => {
    if (!selectedPersonId || !selectedDate) {
      toast("Information manquante", {
        description: "Veuillez sélectionner une personne et une date."
      });
      return;
    }
    
    createDailyAssignment(selectedPersonId, selectedDate);
    
    toast("Garde journalière ajoutée", {
      description: `${standbyPeople.find(p => p.id === selectedPersonId)?.name} a été affecté à la garde du ${format(selectedDate, "P", { locale: fr })}.`
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedAssignmentId ? "Modifier une garde" : "Ajouter une garde"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Type de garde</label>
            <Select 
              defaultValue="day" 
              onValueChange={(value) => {
                // In a real app, you'd handle this selection to toggle between day/week
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Journée</SelectItem>
                <SelectItem value="week">Semaine complète</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Date de garde</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Personne de garde</label>
            <Select 
              value={selectedPersonId} 
              onValueChange={setSelectedPersonId}
            >
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
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={selectedAssignmentId ? handleAssign : handleAssignDay}>
            {selectedAssignmentId ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
