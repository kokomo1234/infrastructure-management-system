
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Calendar, History, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { standbyAssignments, getPersonById } from "@/lib/standbyService";
import { getSubordinates } from "@/lib/hierarchyService";
import { useAuth } from "@/context/AuthContext";

export function StandbyManagementTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const subordinates = getSubordinates(user?.id || "");

  // Filtrer les assignations pour ne montrer que celles des subordonnés
  const subordinateIds = subordinates.map(s => s.id);
  const relevantAssignments = standbyAssignments.filter(assignment => 
    subordinateIds.includes(assignment.personId)
  );

  const openFullStandbyPage = () => {
    navigate('/standby');
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec lien vers la page complète */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion des Gardes</h3>
          <p className="text-sm text-gray-600">
            Gérez les périodes de garde de votre équipe
          </p>
        </div>
        <Button onClick={openFullStandbyPage}>
          <Calendar className="h-4 w-4 mr-2" />
          Ouvrir la planification complète
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{relevantAssignments.length}</p>
                <p className="text-sm text-gray-600">Gardes assignées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {relevantAssignments.filter(a => a.startDate > new Date()).length}
                </p>
                <p className="text-sm text-gray-600">À venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {relevantAssignments.filter(a => a.endDate < new Date()).length}
                </p>
                <p className="text-sm text-gray-600">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des assignations */}
      <Card>
        <CardHeader>
          <CardTitle>Assignations de garde de votre équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relevantAssignments.slice(0, 10).map(assignment => {
              const person = getPersonById(assignment.personId);
              if (!person) return null;

              const isActive = assignment.startDate <= new Date() && assignment.endDate > new Date();
              const isUpcoming = assignment.startDate > new Date();

              return (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={person.avatar} />
                      <AvatarFallback className="text-white bg-blue-600">
                        {person.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(assignment.startDate, "d MMM", { locale: fr })} - {format(assignment.endDate, "d MMM yyyy", { locale: fr })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {assignment.isFullWeek ? 'Semaine complète' : 'Période partielle'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={isActive ? 'default' : isUpcoming ? 'secondary' : 'outline'}>
                      {isActive ? 'En cours' : isUpcoming ? 'À venir' : 'Terminée'}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="h-4 w-4" />
                      {person.phone}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {relevantAssignments.length > 10 && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={openFullStandbyPage}>
                Voir toutes les assignations ({relevantAssignments.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
