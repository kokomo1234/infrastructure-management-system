
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Search } from "lucide-react";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type LogEntry = {
  id: string;
  timestamp: Date;
  user: {
    name: string;
    email: string;
  };
  action: string;
  resource: string;
  status: "success" | "warning" | "error";
  details: string;
  ip?: string;
};

const MOCK_LOGS: LogEntry[] = [
  {
    id: "log1",
    timestamp: new Date(2025, 3, 5, 9, 30),
    user: {
      name: "Admin User",
      email: "admin@example.com",
    },
    action: "LOGIN",
    resource: "Authentication",
    status: "success",
    details: "Logged in successfully",
  },
  {
    id: "log2",
    timestamp: new Date(2025, 3, 5, 10, 15),
    user: {
      name: "Admin User",
      email: "admin@example.com",
    },
    action: "CREATE",
    resource: "User",
    status: "success",
    details: "Created user john@example.com",
  },
  {
    id: "log3",
    timestamp: new Date(2025, 3, 4, 14, 22),
    user: {
      name: "Normal User",
      email: "user@example.com",
    },
    action: "VIEW",
    resource: "Sites",
    status: "success",
    details: "Viewed site list",
  },
  {
    id: "log4",
    timestamp: new Date(2025, 3, 3, 11, 45),
    user: {
      name: "Admin User",
      email: "admin@example.com",
    },
    action: "UPDATE",
    resource: "Equipment",
    status: "warning",
    details: "Updated equipment settings",
  },
  {
    id: "log5",
    timestamp: new Date(2025, 3, 2, 16, 30),
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    action: "DELETE",
    resource: "Maintenance Record",
    status: "error",
    details: "Attempted to delete maintenance record without permission",
  },
];

const UserActivityLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Pour l'instant, utiliser les données de démonstration
      // car il n'y a pas encore de logs dans la base de données
      setLogs(MOCK_LOGS);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter logs based on search query, action, status, and date range
  const filteredLogs = logs.filter((log) => {
    if (
      searchQuery &&
      !log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.resource.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (actionFilter && log.action !== actionFilter) {
      return false;
    }

    if (statusFilter && log.status !== statusFilter) {
      return false;
    }

    if (dateRange && dateRange.from) {
      if (log.timestamp < dateRange.from) {
        return false;
      }
      if (dateRange.to && log.timestamp > dateRange.to) {
        return false;
      }
    }

    return true;
  });

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Email', 'Action', 'Resource', 'Status', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.user.name,
        log.user.email,
        log.action,
        log.resource,
        log.status,
        log.details
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity-logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journaux d'activité des utilisateurs</CardTitle>
        <CardDescription>
          Consultez et analysez l'historique des actions des utilisateurs dans le système.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les journaux..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={actionFilter || "all"} onValueChange={(value) => setActionFilter(value === "all" ? null : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="success">Succès</SelectItem>
                  <SelectItem value="warning">Avertissement</SelectItem>
                  <SelectItem value="error">Erreur</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Date
              </Button>

              <Button variant="outline" size="sm" onClick={handleExportLogs}>
                <Download className="h-4 w-4 mr-1" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Horodatage
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Utilisateur
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Action
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Ressource
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Statut
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Détails
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="text-sm">
                        {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div>
                        <div className="text-sm font-medium">{log.user.name}</div>
                        <div className="text-xs text-muted-foreground">{log.user.email}</div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-sm font-medium">{log.action}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-sm">{log.resource}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={getStatusColor(log.status)}>
                        {log.status === "success" ? "Succès" : 
                         log.status === "warning" ? "Avertissement" : "Erreur"}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-sm">{log.details}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement des journaux...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun journal trouvé correspondant aux critères de recherche.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default UserActivityLogs;
