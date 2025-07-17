
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/project";

interface TaskGanttProps {
  tasks: Task[];
}

export function TaskGantt({ tasks }: TaskGanttProps) {
  // Calculate date range for the Gantt chart
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 30);

  const getDateArray = (start: Date, end: Date) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dateArray = getDateArray(startDate, endDate);
  const totalDays = dateArray.length;

  const getTaskPosition = (task: Task) => {
    if (!task.dueDate) return { left: 0, width: 0 };
    
    const taskDueDate = new Date(task.dueDate);
    const taskStartDate = new Date(task.createdAt);
    
    const startOffset = Math.max(0, (taskStartDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, (taskDueDate.getTime() - taskStartDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const left = (startOffset / totalDays) * 100;
    const width = Math.min((duration / totalDays) * 100, 100 - left);
    
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

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
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue Gantt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline header */}
          <div className="flex border-b pb-2">
            <div className="w-64 font-medium">Tâche</div>
            <div className="flex-1 relative">
              <div className="flex text-xs text-muted-foreground">
                {dateArray.filter((_, index) => index % 7 === 0).map((date, index) => (
                  <div key={index} className="flex-1 text-center">
                    {date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task rows */}
          {tasks.map(task => {
            const position = getTaskPosition(task);
            const hasDependencies = task.dependencies && task.dependencies.length > 0;
            
            return (
              <div key={task.id} className="flex items-center py-2 border-b last:border-b-0">
                <div className="w-64 pr-4">
                  <div className="font-medium text-sm truncate" title={task.title}>
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {task.priority}
                    </Badge>
                    {task.estimatedHours && (
                      <span className="text-xs text-muted-foreground">
                        {task.estimatedHours}h
                      </span>
                    )}
                    {hasDependencies && (
                      <Badge variant="secondary" className="text-xs">
                        Dépendances
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 relative h-8 bg-muted rounded">
                  {/* Today indicator */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                    style={{ 
                      left: `${((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100}%` 
                    }}
                  />
                  
                  {/* Task bar */}
                  <div
                    className={`absolute top-1 bottom-1 rounded ${getStatusColor(task.status)} ${getPriorityColor(task.priority)} border-l-4 flex items-center px-2`}
                    style={position}
                  >
                    <span className="text-white text-xs font-medium truncate">
                      {task.status === 'completed' ? '✓' : ''}
                      {task.title.substring(0, 20)}
                    </span>
                  </div>

                  {/* Dependencies lines */}
                  {hasDependencies && task.dependencies?.map(depId => {
                    const depTask = tasks.find(t => t.id === depId);
                    if (!depTask) return null;
                    
                    const depPosition = getTaskPosition(depTask);
                    return (
                      <div
                        key={depId}
                        className="absolute top-0 h-0.5 bg-orange-400 z-5"
                        style={{
                          left: depPosition.left,
                          width: `calc(${position.left} - ${depPosition.left})`,
                          top: '50%'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucune tâche à afficher dans le Gantt
          </div>
        )}
      </CardContent>
    </Card>
  );
}
