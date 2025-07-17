
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/types/project";

interface TaskWorkloadProps {
  tasks: Task[];
}

export function TaskWorkload({ tasks }: TaskWorkloadProps) {
  // Group tasks by assignee
  const tasksByUser = tasks.reduce((acc, task) => {
    if (!task.assignedTo) return acc;
    
    if (!acc[task.assignedTo]) {
      acc[task.assignedTo] = {
        userId: task.assignedTo,
        tasks: [],
        totalEstimated: 0,
        totalActual: 0,
        completed: 0,
        inProgress: 0,
        todo: 0
      };
    }
    
    acc[task.assignedTo].tasks.push(task);
    acc[task.assignedTo].totalEstimated += task.estimatedHours || 0;
    acc[task.assignedTo].totalActual += task.actualHours || 0;
    
    if (task.status === 'completed') acc[task.assignedTo].completed++;
    else if (task.status === 'in-progress') acc[task.assignedTo].inProgress++;
    else acc[task.assignedTo].todo++;
    
    return acc;
  }, {} as Record<string, {
    userId: string;
    tasks: Task[];
    totalEstimated: number;
    totalActual: number;
    completed: number;
    inProgress: number;
    todo: number;
  }>);

  const users = Object.values(tasksByUser);

  const getWorkloadColor = (estimated: number) => {
    if (estimated <= 20) return 'text-green-600';
    if (estimated <= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWorkloadStatus = (estimated: number) => {
    if (estimated <= 20) return 'Légère';
    if (estimated <= 40) return 'Modérée';
    return 'Élevée';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Répartition de la charge de travail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map(user => {
              const completionRate = user.tasks.length > 0 
                ? (user.completed / user.tasks.length) * 100 
                : 0;
              
              return (
                <Card key={user.userId} className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {user.userId.charAt(user.userId.length - 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">User {user.userId}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.tasks.length} tâche{user.tasks.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Charge de travail</span>
                        <span className={getWorkloadColor(user.totalEstimated)}>
                          {user.totalEstimated}h ({getWorkloadStatus(user.totalEstimated)})
                        </span>
                      </div>
                      <Progress 
                        value={Math.min((user.totalEstimated / 40) * 100, 100)} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression</span>
                        <span>{Math.round(completionRate)}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="p-2 bg-gray-100 rounded">
                        <div className="font-medium text-gray-600">{user.todo}</div>
                        <div className="text-xs text-muted-foreground">À faire</div>
                      </div>
                      <div className="p-2 bg-blue-100 rounded">
                        <div className="font-medium text-blue-600">{user.inProgress}</div>
                        <div className="text-xs text-muted-foreground">En cours</div>
                      </div>
                      <div className="p-2 bg-green-100 rounded">
                        <div className="font-medium text-green-600">{user.completed}</div>
                        <div className="text-xs text-muted-foreground">Terminé</div>
                      </div>
                    </div>

                    {user.totalActual > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Temps passé: {user.totalActual}h
                        {user.totalEstimated > 0 && (
                          <span className={
                            user.totalActual > user.totalEstimated ? 'text-red-600' : 'text-green-600'
                          }>
                            {user.totalActual > user.totalEstimated ? ' (dépassé)' : ' (dans les temps)'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune tâche assignée à afficher
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed task breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des tâches par utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {users.map(user => (
              <div key={user.userId} className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {user.userId.charAt(user.userId.length - 1)}
                    </AvatarFallback>
                  </Avatar>
                  User {user.userId}
                </h4>
                
                <div className="grid gap-2 ml-8">
                  {user.tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          task.status === 'completed' ? 'default' :
                          task.status === 'in-progress' ? 'secondary' : 'outline'
                        }>
                          {task.status === 'todo' ? 'À faire' : 
                           task.status === 'in-progress' ? 'En cours' : 'Terminé'}
                        </Badge>
                        <span className="text-sm">{task.title}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {task.estimatedHours && (
                          <span>{task.estimatedHours}h estimé</span>
                        )}
                        {task.actualHours && (
                          <span>• {task.actualHours}h passé</span>
                        )}
                        {task.dueDate && (
                          <span>• {new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
