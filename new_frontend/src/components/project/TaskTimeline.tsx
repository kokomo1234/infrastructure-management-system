
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/types/project";

interface TaskTimelineProps {
  tasks: Task[];
}

export function TaskTimeline({ tasks }: TaskTimelineProps) {
  // Sort tasks by creation date
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'todo': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline des tâches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {sortedTasks.map((task, index) => (
              <div key={task.id} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div className={`relative z-10 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(task.status)}`} />
                
                {/* Task card */}
                <div className={`flex-1 p-4 rounded-lg border-2 ${getPriorityColor(task.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{task.title}</h4>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {task.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge className={getStatusColor(task.status)} variant="secondary">
                          {task.status === 'todo' ? 'À faire' : 
                           task.status === 'in-progress' ? 'En cours' : 'Terminé'}
                        </Badge>
                        
                        <Badge variant="outline">
                          {task.priority === 'high' ? 'Priorité élevée' :
                           task.priority === 'medium' ? 'Priorité moyenne' : 'Priorité faible'}
                        </Badge>
                        
                        {task.estimatedHours && (
                          <Badge variant="secondary">
                            {task.estimatedHours}h estimé
                          </Badge>
                        )}
                        
                        {task.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right text-sm">
                      {task.assignedTo && (
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {task.assignedTo.charAt(task.assignedTo.length - 1)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">User {task.assignedTo}</span>
                        </div>
                      )}
                      
                      <div className="space-y-1 text-muted-foreground">
                        <div>Créé: {formatDate(task.createdAt)}</div>
                        {task.dueDate && (
                          <div className={
                            new Date(task.dueDate) < new Date() && task.status !== 'completed' 
                              ? 'text-red-600 font-medium' 
                              : ''
                          }>
                            Échéance: {formatDate(task.dueDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar for in-progress tasks */}
                  {task.status === 'in-progress' && task.estimatedHours && task.actualHours && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progression</span>
                        <span>{task.actualHours}h / {task.estimatedHours}h</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {sortedTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune tâche à afficher dans la timeline
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
