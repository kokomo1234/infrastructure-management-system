
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Activity, BarChart3, TrendingUp, Users } from "lucide-react";
import { logsColumns, mockLogs, getActionColor } from "@/lib/logsColumns";
import CustomizableTable from "@/components/equipment/CustomizableTable";

// Simple activity reports component inline
const ActivityReports = () => {
  const stats = [
    {
      title: "Actions aujourd'hui",
      value: "127",
      icon: Activity,
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Utilisateurs actifs",
      value: "23",
      icon: Users,
      change: "+3%",
      changeType: "positive"
    },
    {
      title: "Modifications cette semaine",
      value: "489",
      icon: TrendingUp,
      change: "+18%",
      changeType: "positive"
    },
    {
      title: "Taux d'erreur",
      value: "2.1%",
      icon: BarChart3,
      change: "-0.5%",
      changeType: "negative"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} par rapport à la semaine dernière
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition des actions par type</CardTitle>
          <CardDescription>
            Distribution des activités sur les 30 derniers jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Modifications</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-16"></div>
                </div>
                <span className="text-sm text-muted-foreground">67%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ajouts</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-12"></div>
                </div>
                <span className="text-sm text-muted-foreground">50%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Suppressions</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full w-8"></div>
                </div>
                <span className="text-sm text-muted-foreground">33%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Remplacements</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-4"></div>
                </div>
                <span className="text-sm text-muted-foreground">17%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("week");
  
  // Filtrer les journaux
  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = 
      log.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filter === "all" || log.action === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Registre</h2>
        <p className="text-muted-foreground">
          Journaux de maintenance et d'intervention sur les équipements.
        </p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher dans les journaux..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-1/2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les actions</SelectItem>
              <SelectItem value="Ajout">Ajout</SelectItem>
              <SelectItem value="Modification">Modification</SelectItem>
              <SelectItem value="Retrait">Retrait</SelectItem>
              <SelectItem value="Remplacement">Remplacement</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="all">Tout l'historique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Période personnalisée</span>
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Historique des interventions</CardTitle>
              <CardDescription>Registre chronologique des activités</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomizableTable
                data={filteredLogs}
                defaultColumns={logsColumns}
                equipmentType="logs"
                getStatusColor={getActionColor}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Rapports d'activité</CardTitle>
              <CardDescription>Synthèse et analyse des modifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityReports />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Logs;
