
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MoreHorizontal, Eye } from "lucide-react";
import { Project } from "@/types/project";
import { ProjectDetailDialog } from "./ProjectDetailDialog";

// Mock data - remplacez par vos vraies données
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Maintenance Infrastructure",
    description: "Projet de maintenance préventive des équipements",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    status: "active",
    createdBy: "user1",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-20"
  },
  {
    id: "2",
    name: "Migration Système DC",
    description: "Migration et mise à niveau du système DC",
    startDate: "2024-02-01",
    endDate: "2024-08-30",
    status: "active",
    createdBy: "user1",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-01"
  },
  {
    id: "3",
    name: "Formation Équipe",
    description: "Programme de formation pour l'équipe technique",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "completed",
    createdBy: "user1",
    createdAt: "2023-12-15",
    updatedAt: "2024-03-31"
  }
];

export function ProjectGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setDetailOpen(true);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(project.endDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  3 membres
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleProjectClick(project)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir le projet
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectDetailDialog
        project={selectedProject}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
