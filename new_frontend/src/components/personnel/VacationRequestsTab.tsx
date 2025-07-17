
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle, XCircle, Clock, MessageSquare, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getSubordinates } from "@/lib/hierarchyService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface VacationRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
}

export function VacationRequestsTab() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VacationRequest | null>(null);
  const [newRequestDialogOpen, setNewRequestDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const subordinates = getSubordinates(user?.id || "");

  // Mock data pour les demandes de vacances
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([
    {
      id: "1",
      employeeId: "3",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      reason: "Vacances familiales",
      status: "pending",
      requestedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "2",
      employeeId: "4",
      startDate: "2024-03-01",
      endDate: "2024-03-05",
      reason: "Congé personnel",
      status: "approved",
      requestedAt: "2024-01-10T14:30:00Z",
      respondedAt: "2024-01-12T09:15:00Z"
    }
  ]);

  const getEmployeeById = (id: string) => subordinates.find(emp => emp.id === id);

  const handleCreateRequest = () => {
    if (!newRequest.employeeId || !newRequest.startDate || !newRequest.endDate || !newRequest.reason) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const request: VacationRequest = {
      id: Date.now().toString(),
      employeeId: newRequest.employeeId,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      reason: newRequest.reason,
      status: "pending",
      requestedAt: new Date().toISOString()
    };

    setVacationRequests(prev => [...prev, request]);
    setNewRequest({ employeeId: "", startDate: "", endDate: "", reason: "" });
    setNewRequestDialogOpen(false);
    toast.success("Demande de vacances créée");
  };

  const handleApprove = (requestId: string) => {
    setVacationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' as const, respondedAt: new Date().toISOString() }
          : req
      )
    );
    toast.success("Demande de vacances approuvée");
  };

  const handleReject = (requestId: string) => {
    setVacationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as const, respondedAt: new Date().toISOString() }
          : req
      )
    );
    toast.success("Demande de vacances refusée");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Refusée</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    }
  };

  const filteredRequests = selectedStatus === "all" 
    ? vacationRequests 
    : vacationRequests.filter(req => req.status === selectedStatus);

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Demandes de vacances</h3>
          <p className="text-sm text-gray-600">
            Gérez les demandes de congés de votre équipe
          </p>
        </div>
        <Dialog open={newRequestDialogOpen} onOpenChange={setNewRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une demande de vacances</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Employé</Label>
                <Select value={newRequest.employeeId} onValueChange={(value) => setNewRequest({...newRequest, employeeId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {subordinates.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de début</Label>
                  <Input 
                    type="date" 
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Date de fin</Label>
                  <Input 
                    type="date" 
                    value={newRequest.endDate}
                    onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Raison</Label>
                <Textarea 
                  placeholder="Raison de la demande..."
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                />
              </div>
              <Button className="w-full" onClick={handleCreateRequest}>
                Créer la demande
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{vacationRequests.filter(r => r.status === 'pending').length}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{vacationRequests.filter(r => r.status === 'approved').length}</p>
                <p className="text-sm text-gray-600">Approuvées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{vacationRequests.filter(r => r.status === 'rejected').length}</p>
                <p className="text-sm text-gray-600">Refusées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{vacationRequests.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de vacances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map(request => {
              const employee = getEmployeeById(request.employeeId);
              if (!employee) return null;

              return (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>
                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(request.startDate), "d MMM", { locale: fr })} - {format(new Date(request.endDate), "d MMM yyyy", { locale: fr })}
                      </p>
                      <p className="text-sm text-gray-600">{request.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(request.status)}
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    )}
                    
                    <Dialog open={commentDialogOpen && selectedRequest?.id === request.id} onOpenChange={setCommentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Commentaire
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ajouter un commentaire</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea 
                            placeholder="Votre commentaire..."
                            className="min-h-[100px]"
                          />
                          <Button className="w-full">Envoyer</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
