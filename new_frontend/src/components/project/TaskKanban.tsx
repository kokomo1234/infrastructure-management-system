
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/project";

interface TaskKanbanProps {
  tasks: Task[];
}

export function TaskKanban({ tasks }: TaskKanbanProps) {
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm">{task.title}</h4>
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {getPriorityText(task.priority)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
          {task.dueDate && (
            <div className="text-xs text-muted-foreground">
              Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* À faire */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              À faire
              <Badge variant="secondary">{todoTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todoTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            {todoTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune tâche à faire
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* En cours */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              En cours
              <Badge variant="secondary">{inProgressTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgressTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            {inProgressTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune tâche en cours
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Terminé */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Terminé
              <Badge variant="secondary">{completedTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            {completedTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune tâche terminée
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
