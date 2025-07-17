
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Plus, CheckSquare, FileText, Zap, Clock, BarChart3 } from "lucide-react";
import { Project, Task } from "@/types/project";
import { TasksView } from "./TasksView";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { ProjectDocuments } from "./ProjectDocuments";
import { AutomationRules } from "./AutomationRules";
import { ProjectReports } from "./ProjectReports";

interface ProjectDetailDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock tasks data with enhanced fields
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Inspection des équipements UPS",
    description: "Vérification complète des systèmes UPS",
    projectId: "1",
    assignedTo: "user1",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-02-15",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25",
    estimatedHours: 8,
    actualHours: 5,
    tags: ["maintenance", "urgent"]
  },
  {
    id: "2",
    title: "Remplacement des batteries",
    description: "Changement des batteries défectueuses",
    projectId: "1",
    assignedTo: "user2",
    priority: "medium",
    status: "todo",
    dueDate: "2024-02-20",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
    estimatedHours: 4,
    tags: ["hardware"]
  }
];

export function ProjectDetailDialog({ project, open, onOpenChange }: ProjectDetailDialogProps) {
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  if (!project) return null;

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'completed': return 'Terminé';
      case 'on-hold': return 'En pause';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const projectTasks = mockTasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
  const totalTasks = projectTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">{project.name}</DialogTitle>
                <Badge className={`mt-2 ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Project Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div>Début: {new Date(project.startDate).toLocaleDateString('fr-FR')}</div>
                    <div>Fin: {new Date(project.endDate).toLocaleDateString('fr-FR')}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div>{completedTasks}/{totalTasks} tâches</div>
                    <div className="text-muted-foreground">{Math.round(progressPercentage)}% terminé</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Équipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">3 membres actifs</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Temps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div>Estimé: 32h</div>
                    <div className="text-muted-foreground">Passé: 28h</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>

            {/* Enhanced Tabs */}
            <Tabs defaultValue="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="tasks" className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Tâches
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Docs
                  </TabsTrigger>
                  <TabsTrigger value="automations" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Auto
                  </TabsTrigger>
                  <TabsTrigger value="members" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Équipe
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Rapports
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    Paramètres
                  </TabsTrigger>
                </TabsList>
                <Button onClick={() => setCreateTaskOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle tâche
                </Button>
              </div>
              
              <TabsContent value="tasks">
                <TasksView projectId={project.id} />
              </TabsContent>

              <TabsContent value="docs">
                <ProjectDocuments projectId={project.id} />
              </TabsContent>

              <TabsContent value="automations">
                <AutomationRules projectId={project.id} />
              </TabsContent>

              <TabsContent value="members">
                <Card>
                  <CardHeader>
                    <CardTitle>Membres du projet</CardTitle>
                    <CardDescription>Gérez les membres et leurs permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                            U1
                          </div>
                          <div>
                            <div className="font-medium">User 1</div>
                            <div className="text-sm text-muted-foreground">user1@example.com</div>
                          </div>
                        </div>
                        <Badge>Propriétaire</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-medium">
                            U2
                          </div>
                          <div>
                            <div className="font-medium">User 2</div>
                            <div className="text-sm text-muted-foreground">user2@example.com</div>
                          </div>
                        </div>
                        <Badge variant="secondary">Membre</Badge>
                      </div>

                      <Button className="w-full" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Inviter un membre
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <ProjectReports projectId={project.id} />
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres du projet</CardTitle>
                    <CardDescription>Configurez les paramètres avancés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Fonctionnalités de paramètres à venir...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        projectId={project.id}
      />
    </>
  );
}
