
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { standbyPeople, requestStandbyChange } from "@/lib/standbyService";
import { useAuth } from "@/context/AuthContext";

interface StandbyExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StandbyExchangeDialog({ open, onOpenChange }: StandbyExchangeDialogProps) {
  const { user } = useAuth();
  const [exchangeType, setExchangeType] = useState<"give" | "request">("give");
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [proposedDate, setProposedDate] = useState<Date | undefined>();
  const [message, setMessage] = useState<string>("");
  
  const handleExchange = () => {
    if (!selectedPerson || !selectedDate || !user) {
      toast("Information manquante", {
        description: "Veuillez sélectionner une personne et une date.",
      });
      return;
    }
    
    const startDate = new Date(selectedDate);
    startDate.setHours(16, 0, 0, 0);
    
    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(7, 0, 0, 0);
    
    if (exchangeType === "give") {
      // Donner sa garde à quelqu'un
      requestStandbyChange(user.id, selectedPerson, startDate, endDate, 
        `${message}\n\nType: Don de garde`);
      
      toast.success("Don de garde proposé", {
        description: `Votre proposition de don pour le ${format(selectedDate, "P", { locale: fr })} a été envoyée.`,
      });
    } else {
      // Demander un échange
      let exchangeMessage = message;
      if (proposedDate) {
        exchangeMessage += `\n\nEn échange de ma garde du ${format(proposedDate, "P", { locale: fr })}`;
      }
      
      requestStandbyChange(user.id, selectedPerson, startDate, endDate, 
        `${exchangeMessage}\n\nType: Demande d'échange`);
      
      toast.success("Demande d'échange envoyée", {
        description: `Votre demande d'échange pour le ${format(selectedDate, "P", { locale: fr })} a été envoyée.`,
      });
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Échanger une garde</DialogTitle>
          <DialogDescription>
            Proposez un don de garde ou demandez un échange avec un collègue
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={exchangeType} onValueChange={(value) => setExchangeType(value as "give" | "request")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="give">Donner ma garde</TabsTrigger>
            <TabsTrigger value="request">Demander un échange</TabsTrigger>
          </TabsList>
          
          <TabsContent value="give" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date à donner</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Personne à qui donner</label>
              <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une personne" />
                </SelectTrigger>
                <SelectContent>
                  {standbyPeople
                    .filter(person => person.id !== user?.id)
                    .map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="request" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date souhaitée</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Date proposée en échange (optionnel)</label>
              <Calendar
                mode="single"
                selected={proposedDate}
                onSelect={setProposedDate}
                className="rounded-md border"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Personne à qui demander</label>
              <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une personne" />
                </SelectTrigger>
                <SelectContent>
                  {standbyPeople
                    .filter(person => person.id !== user?.id)
                    .map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">Message</label>
            <Textarea
              placeholder="Expliquez votre demande..."
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
          <Button onClick={handleExchange}>
            {exchangeType === "give" ? "Proposer le don" : "Demander l'échange"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
