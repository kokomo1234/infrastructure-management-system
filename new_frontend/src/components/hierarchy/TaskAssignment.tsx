
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HierarchyUser, TaskAssignment as TaskAssignmentType } from '@/types/hierarchy';
import { getSubordinates, getUserTasks, getTasksAssignedBy, getAllSubordinatesRecursive } from '@/lib/hierarchyService';
import { useAuth } from '@/context/AuthContext';
import { Plus, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const TaskAssignment = () => {
  const { user: currentUser } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  // Récupérer les subordonnés de l'utilisateur actuel
  const directSubordinates = getSubordinates(currentUser?.id || '');
  const allSubordinates = getAllSubordinatesRecursive(currentUser?.id || '');
  
  // Tâches assignées par l'utilisateur actuel
  const assignedTasks = getTasksAssignedBy(currentUser?.id || '');
  
  // Tâches de l'utilisateur actuel
  const myTasks = getUserTasks(currentUser?.id || '');

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    // Simuler la création de tâche
    const task: TaskAssignmentType = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignedBy: currentUser?.id || '',
      assignedTo: newTask.assignedTo,
      status: 'not_started',
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    toast.success('Tâche créée et assignée avec succès');
    setIsCreateDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      default:
        return <Badge variant="outline">Non commencée</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Haute</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Moyenne</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Basse</Badge>;
    }
  };

  const getUserById = (id: string): HierarchyUser | undefined => {
    return allSubordinates.find(user => user.id === id);
  };

  if (currentUser?.role === 'standard') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes Tâches</CardTitle>
        </CardHeader>
        <CardContent>
          {myTasks.length > 0 ? (
            <div className="space-y-4">
              {myTasks.map(task => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <h4 className="font-semibold">{task.title}</h4>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune tâche assignée</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Tâches</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer une tâche
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle tâche</DialogTitle>
                <DialogDescription>
                  Assignez une tâche à l'un de vos subordonnés
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-title">Titre de la tâche</Label>
                  <Input
                    id="task-title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Titre de la tâche..."
                  />
                </div>
                <div>
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Description détaillée..."
                  />
                </div>
                <div>
                  <Label htmlFor="task-assignee">Assigner à</Label>
                  <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un subordonné..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allSubordinates.map(subordinate => (
                        <SelectItem key={subordinate.id} value={subordinate.id}>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={subordinate.avatar} />
                              <AvatarFallback className="text-xs">
                                {subordinate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{subordinate.name}</span>
                            <span className="text-gray-500 text-sm">({subordinate.position})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="task-priority">Priorité</Label>
                    <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="task-due-date">Date d'échéance</Label>
                    <Input
                      id="task-due-date"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateTask}>
                  Créer la tâche
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Tâches que j'ai assignées ({assignedTasks.length})</h3>
              {assignedTasks.length > 0 ? (
                <div className="space-y-3">
                  {assignedTasks.map(task => {
                    const assignee = getUserById(task.assignedTo);
                    return (
                      <Card key={task.id} className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(task.status)}
                              <h4 className="font-medium text-sm">{task.title}</h4>
                              {getPriorityBadge(task.priority)}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                            {assignee && (
                              <div className="flex items-center space-x-2 mt-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={assignee.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-500">{assignee.name}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            {getStatusBadge(task.status)}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucune tâche assignée</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-4">Mes tâches ({myTasks.length})</h3>
              {myTasks.length > 0 ? (
                <div className="space-y-3">
                  {myTasks.map(task => (
                    <Card key={task.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(task.status)}
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            {getPriorityBadge(task.priority)}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                          {task.dueDate && (
                            <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          {getStatusBadge(task.status)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucune tâche personnelle</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskAssignment;
