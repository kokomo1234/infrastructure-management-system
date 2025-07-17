
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getSubordinates, getTasksAssignedBy } from "@/lib/hierarchyService";
import { useAuth } from "@/context/AuthContext";

export function WorkloadTrackingTab() {
  const { user } = useAuth();
  const subordinates = getSubordinates(user?.id || "");
  const assignedTasks = getTasksAssignedBy(user?.id || "");

  // Calculer la charge de travail pour chaque employé
  const workloadData = subordinates.map(employee => {
    const employeeTasks = assignedTasks.filter(task => task.assignedTo === employee.id);
    const activeTasks = employeeTasks.filter(task => task.status !== 'completed');
    const highPriorityTasks = activeTasks.filter(task => task.priority === 'high');
    
    // Calcul simple de la charge (peut être amélioré avec des poids)
    const workloadScore = activeTasks.length * 20 + highPriorityTasks.length * 10;
    const workloadPercentage = Math.min(workloadScore, 100);
    
    let workloadLevel: 'low' | 'normal' | 'high' = 'normal';
    if (workloadPercentage < 30) workloadLevel = 'low';
    else if (workloadPercentage > 70) workloadLevel = 'high';

    return {
      employee,
      activeTasks: activeTasks.length,
      completedTasks: employeeTasks.filter(task => task.status === 'completed').length,
      highPriorityTasks: highPriorityTasks.length,
      workloadPercentage,
      workloadLevel
    };
  });

  const getWorkloadColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getWorkloadIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'high':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };

  const getWorkloadBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Sous-chargé</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Surchargé</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{subordinates.length}</p>
                <p className="text-sm text-gray-600">Employés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{workloadData.filter(w => w.workloadLevel === 'low').length}</p>
                <p className="text-sm text-gray-600">Sous-chargés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{workloadData.filter(w => w.workloadLevel === 'normal').length}</p>
                <p className="text-sm text-gray-600">Charge normale</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{workloadData.filter(w => w.workloadLevel === 'high').length}</p>
                <p className="text-sm text-gray-600">Surchargés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charge de travail par employé */}
      <Card>
        <CardHeader>
          <CardTitle>Charge de travail de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {workloadData.map(({ employee, activeTasks, completedTasks, highPriorityTasks, workloadPercentage, workloadLevel }) => (
              <div key={employee.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>
                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getWorkloadIcon(workloadLevel)}
                    {getWorkloadBadge(workloadLevel)}
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Charge de travail</span>
                    <span className={`text-sm font-medium ${getWorkloadColor(workloadLevel)}`}>
                      {workloadPercentage}%
                    </span>
                  </div>
                  <Progress 
                    value={workloadPercentage} 
                    className="h-2"
                  />
                </div>

                {/* Détails des tâches */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{activeTasks}</p>
                    <p className="text-gray-600">Tâches actives</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{highPriorityTasks}</p>
                    <p className="text-gray-600">Haute priorité</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                    <p className="text-gray-600">Terminées</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workloadData.filter(w => w.workloadLevel === 'high').length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">⚠️ Employés surchargés détectés</p>
                <p className="text-red-700 text-sm">
                  Considérez redistribuer certaines tâches ou reporter des échéances.
                </p>
              </div>
            )}
            
            {workloadData.filter(w => w.workloadLevel === 'low').length > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">✅ Capacité disponible</p>
                <p className="text-green-700 text-sm">
                  Des employés ont de la capacité pour prendre des tâches supplémentaires.
                </p>
              </div>
            )}
            
            {workloadData.every(w => w.workloadLevel === 'normal') && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">🎯 Équilibre optimal</p>
                <p className="text-blue-700 text-sm">
                  La charge de travail est bien répartie dans votre équipe.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
