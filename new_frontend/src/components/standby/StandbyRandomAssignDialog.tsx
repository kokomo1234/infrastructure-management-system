
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shuffle } from "lucide-react";
import { toast } from "sonner";
import { StandbyPersonDisplay } from "@/components/dashboard/standby/StandbyPersonDisplay";
import { standbyPeople, updateStandbyAssignment } from "@/lib/standbyService";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StandbyRandomAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StandbyRandomAssignDialog({ open, onOpenChange }: StandbyRandomAssignDialogProps) {
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weeksCount, setWeeksCount] = useState<number>(26); // 6 months
  
  const togglePerson = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };
  
  const handleRandomAssign = () => {
    if (selectedPeople.length === 0) {
      toast.error("Sélectionnez des personnes", {
        description: "Veuillez sélectionner au moins une personne pour l'assignation aléatoire."
      });
      return;
    }
    
    // In a real app, we would make API calls to update the assignments
    // For this example, we just show a toast message
    
    toast.success("Assignation aléatoire réussie", {
      description: `${selectedPeople.length} personnes ont été assignées aléatoirement sur ${weeksCount} semaines.`
    });
    
    onOpenChange(false);
  };
  
  // Generate week options
  const weekOptions = [
    { value: "13", label: "3 mois (13 semaines)" },
    { value: "26", label: "6 mois (26 semaines)" },
    { value: "52", label: "1 an (52 semaines)" }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" /> 
            Assignation aléatoire des gardes
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Paramètres</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début</Label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground">La première garde commencera le vendredi suivant cette date</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeks-count">Période</Label>
                <Select 
                  value={weeksCount.toString()} 
                  onValueChange={(value) => setWeeksCount(parseInt(value))}
                >
                  <SelectTrigger id="weeks-count" className="w-full">
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Nombre de semaines à planifier</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personnes à assigner</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez les personnes à inclure dans la rotation aléatoire.
              Chaque personne sera assignée pour un nombre égal de semaines.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {standbyPeople.map((person) => (
                <Card key={person.id} className={`border-2 transition-colors ${selectedPeople.includes(person.id) ? 'border-infra-blue bg-blue-50' : 'border-gray-200'}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <StandbyPersonDisplay 
                      person={person} 
                      borderColor={selectedPeople.includes(person.id) ? "border-infra-blue" : "border-gray-300"}
                      bgColor={selectedPeople.includes(person.id) ? "bg-infra-blue" : "bg-gray-200"}
                      compact
                    />
                    <Checkbox 
                      id={`person-${person.id}`}
                      checked={selectedPeople.includes(person.id)}
                      onCheckedChange={() => togglePerson(person.id)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleRandomAssign}>
            <Shuffle className="h-4 w-4 mr-2" /> 
            Assigner aléatoirement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
