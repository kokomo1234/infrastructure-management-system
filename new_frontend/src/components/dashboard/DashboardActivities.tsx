
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";

// Mock data pour les activités récentes - en production, ceci viendrait de l'API
const recentActivities = [
  {
    id: "1",
    type: "maintenance",
    title: "Maintenance UPS #32 complétée",
    status: "completed",
    timestamp: "Aujourd'hui, 09:36",
    equipmentId: "UPS-32",
    priority: "normal"
  },
  {
    id: "2",
    type: "work-order",
    title: "Appel de service - Panne UAC site Québec",
    status: "in-progress",
    timestamp: "Aujourd'hui, 08:15",
    equipmentId: "UAC-QB-01",
    priority: "high"
  },
  {
    id: "3",
    type: "maintenance",
    title: "Inspection générateur planifiée",
    status: "scheduled",
    timestamp: "Hier, 18:22",
    equipmentId: "GEN-045",
    priority: "normal"
  },
  {
    id: "4",
    type: "work-order",
    title: "Alerte température TSW-045",
    status: "urgent",
    timestamp: "Hier, 14:50",
    equipmentId: "TSW-045",
    priority: "urgent"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "scheduled":
      return <Calendar className="h-4 w-4 text-yellow-500" />;
    case "urgent":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <div className="rounded-full w-2 h-2 bg-gray-500"></div>;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "in-progress":
      return "bg-blue-500";
    case "scheduled":
      return "bg-yellow-500";
    case "urgent":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "maintenance":
      return <Wrench className="h-3 w-3" />;
    case "work-order":
      return <AlertTriangle className="h-3 w-3" />;
    default:
      return null;
  }
};

export function DashboardActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités Récentes</CardTitle>
        <CardDescription>Entretiens et appels de service récents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(activity.status)}
                <Badge variant="outline" className="text-xs">
                  {getTypeIcon(activity.type)}
                  <span className="ml-1 capitalize">{activity.type === 'maintenance' ? 'Entretien' : 'Appel'}</span>
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  <Badge variant="secondary" className="text-xs">
                    {activity.equipmentId}
                  </Badge>
                  {activity.priority === 'urgent' && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                  {activity.priority === 'high' && (
                    <Badge variant="default" className="text-xs bg-orange-500">
                      Priorité élevée
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
