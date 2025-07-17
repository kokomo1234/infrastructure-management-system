
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, Users, Clock, CheckSquare } from "lucide-react";

interface ProjectReportsProps {
  projectId: string;
}

export function ProjectReports({ projectId }: ProjectReportsProps) {
  // Mock data for charts
  const taskStatusData = [
    { name: "À faire", value: 5, color: "#8b5cf6" },
    { name: "En cours", value: 3, color: "#3b82f6" },
    { name: "Terminé", value: 8, color: "#10b981" }
  ];

  const weeklyProgressData = [
    { week: "S1", completed: 2, created: 3 },
    { week: "S2", completed: 3, created: 2 },
    { week: "S3", completed: 1, created: 4 },
    { week: "S4", completed: 5, created: 1 },
    { week: "S5", completed: 2, created: 2 }
  ];

  const userWorkloadData = [
    { user: "User 1", tasks: 6, hours: 24 },
    { user: "User 2", tasks: 4, hours: 16 },
    { user: "User 3", tasks: 3, hours: 12 },
    { user: "User 4", tasks: 3, hours: 8 }
  ];

  const priorityData = [
    { priority: "Élevée", count: 4 },
    { priority: "Moyenne", count: 8 },
    { priority: "Faible", count: 4 }
  ];

  const exportToPDF = () => {
    // Simulation d'export PDF
    console.log("Exporting project report to PDF...");
    // Ici vous pourriez intégrer une librairie comme jsPDF
  };

  const exportToCSV = () => {
    // Simulation d'export CSV
    console.log("Exporting project data to CSV...");
    // Ici vous pourriez générer et télécharger un fichier CSV
  };

  const chartConfig = {
    completed: {
      label: "Terminées",
      color: "hsl(var(--primary))",
    },
    created: {
      label: "Créées", 
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches totales</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">+2 cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipe active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">membres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128h</div>
            <p className="text-xs text-muted-foreground">sur 150h estimées</p>
          </CardContent>
        </Card>
      </div>

      {/* Export Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Export des données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={exportToPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des tâches</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              {taskStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progression hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgressData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="var(--color-completed)" 
                    strokeWidth={2}
                    name="Terminées"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="created" 
                    stroke="var(--color-created)" 
                    strokeWidth={2}
                    name="Créées"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Workload */}
        <Card>
          <CardHeader>
            <CardTitle>Charge par utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userWorkloadData}>
                  <XAxis dataKey="user" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="tasks" fill="var(--color-completed)" name="Tâches" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par priorité</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-secondary)" name="Nombre" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Performance</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Délai moyen de réalisation</span>
                  <span>3.2 jours</span>
                </div>
                <div className="flex justify-between">
                  <span>Tâches en retard</span>
                  <Badge variant="destructive">2</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Taux de completion</span>
                  <span>87%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Productivité</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Tâches/jour (moyenne)</span>
                  <span>2.3</span>
                </div>
                <div className="flex justify-between">
                  <span>Temps moyen/tâche</span>
                  <span>8h</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficacité</span>
                  <Badge variant="default">Bonne</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Qualité</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Tâches reprises</span>
                  <span>1</span>
                </div>
                <div className="flex justify-between">
                  <span>Commentaires moyens/tâche</span>
                  <span>2.1</span>
                </div>
                <div className="flex justify-between">
                  <span>Score qualité</span>
                  <Badge variant="default">Excellent</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
