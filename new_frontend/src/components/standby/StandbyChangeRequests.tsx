
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { standbyChangeRequests, getPersonById, respondToChangeRequest } from "@/lib/standbyService";

export function StandbyChangeRequests() {
  const handleApprove = (requestId: string) => {
    const success = respondToChangeRequest(requestId, true);
    
    if (success) {
      toast.success("Demande approuvée", {
        description: "Le calendrier de garde a été mis à jour."
      });
    } else {
      toast.error("Erreur", {
        description: "Impossible d'approuver la demande."
      });
    }
  };
  
  const handleReject = (requestId: string) => {
    const success = respondToChangeRequest(requestId, false);
    
    if (success) {
      toast.success("Demande refusée", {
        description: "Le demandeur a été informé."
      });
    } else {
      toast.error("Erreur", {
        description: "Impossible de refuser la demande."
      });
    }
  };

  // Filter to only show pending requests
  const pendingRequests = standbyChangeRequests.filter(req => req.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Demandes de remplacement en attente</span>
          {pendingRequests.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {pendingRequests.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingRequests.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Aucune demande de remplacement en attente
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Demandeur</TableHead>
                <TableHead>Remplaçant demandé</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map(request => {
                const requester = getPersonById(request.requesterId);
                const requested = getPersonById(request.requestedPersonId);
                
                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">
                        {format(request.startDate, "P", { locale: fr })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.startDate.getHours() === 16 && request.endDate.getHours() === 7 && 
                         format(request.startDate, "dd/MM") !== format(request.endDate, "dd/MM")
                          ? "Semaine complète"
                          : `De ${format(request.startDate, "HH:mm")} à ${format(request.endDate, "HH:mm")}`
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-infra-blue text-white text-xs">
                            {requester?.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>{requester?.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-500 text-white text-xs">
                            {requested?.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>{requested?.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.message || <span className="text-muted-foreground italic">Aucun message</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approuver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(request.id)}
                        >
                          Refuser
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
