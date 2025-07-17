
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FolderOpen, List } from "lucide-react";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { TasksView } from "@/components/project/TasksView";
import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";
import { NotificationCenter } from "@/components/project/NotificationCenter";

const ProjectManagement = () => {
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion de Projet</h2>
          <p className="text-muted-foreground">
            Organisez vos projets et tâches efficacement avec des outils avancés
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Projets
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Toutes les tâches
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Mes Projets</h3>
              <p className="text-sm text-muted-foreground">Gérez tous vos projets avec des vues avancées</p>
            </div>
            <Button onClick={() => setCreateProjectOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau Projet
            </Button>
          </div>
          <ProjectGrid />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Vue d'ensemble des tâches</h3>
              <p className="text-sm text-muted-foreground">
                Visualisez toutes vos tâches avec Kanban, Gantt, Timeline et plus
              </p>
            </div>
          </div>
          <TasksView />
        </TabsContent>
      </Tabs>

      <CreateProjectDialog 
        open={createProjectOpen} 
        onOpenChange={setCreateProjectOpen} 
      />
    </div>
  );
};

export default ProjectManagement;
