
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, AlertCircle, User } from "lucide-react";
import { Task } from "@/types/project";

interface TaskListProps {
  tasks: Task[];
  showProject?: boolean;
}

export function TaskList({ tasks, showProject = false }: TaskListProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'À faire';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold">{task.title}</h4>
                {showProject && (
                  <p className="text-xs text-muted-foreground">Projet #{task.projectId}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityText(task.priority)}
                </Badge>
                <Badge className={getStatusColor(task.status)}>
                  {getStatusText(task.status)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </div>
                )}
                {task.assignedTo && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Assigné à: User {task.assignedTo}
                  </div>
                )}
              </div>
              
              {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                <div className="flex items-center gap-1 text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  En retard
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {tasks.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune tâche trouvée
          </CardContent>
        </Card>
      )}
    </div>
  );
}
