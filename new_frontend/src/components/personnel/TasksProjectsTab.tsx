import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, CheckSquare, Calendar, User, Settings } from "lucide-react";
import { getSubordinates } from "@/lib/hierarchyService";
import { useAuth } from "@/context/AuthContext";
import { TaskColumnManager, TaskColumn } from "./TaskColumnManager";
import { toast } from "sonner";

interface PersonnelTask {
  id: string;
  title: string;
  assignedTo: string;
  status: string;
  deadline: string;
  customData: Record<string, string>;
}

export function TasksProjectsTab() {
  const { user } = useAuth();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    customData: {} as Record<string, string>
  });
  const [customColumns, setCustomColumns] = useState<TaskColumn[]>([
    { id: "site", label: "Site", type: "text", required: true },
    { id: "address", label: "Adresse", type: "text", required: false },
    { id: "priority", label: "Priorité", type: "select", options: ["Basse", "Normale", "Haute", "Urgente"], required: true }
  ]);

  const subordinates = getSubordinates(user?.id || "");

  // Mock data pour les tâches avec colonnes personnalisées
  const [tasks, setTasks] = useState<PersonnelTask[]>([
    { 
      id: "1", 
      title: "Maintenance préventive", 
      assignedTo: "3", 
      status: "en_cours", 
      deadline: "2024-01-20",
      customData: {
        site: "Site A - Bâtiment Principal",
        address: "123 Rue des Érables",
        priority: "Haute"
      }
    },
    { 
      id: "2", 
      title: "Réparation onduleur", 
      assignedTo: "4", 
      status: "termine", 
      deadline: "2024-01-18",
      customData: {
        site: "Site B - Datacenter",
        address: "456 Avenue Tech",
        priority: "Urgente"
      }
    },
  ]);

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      toast.error("Veuillez remplir au moins le titre et assigner la tâche");
      return;
    }

    const task: PersonnelTask = {
      id: Date.now().toString(),
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      status: "en_attente",
      deadline: newTask.deadline,
      customData: { ...newTask.customData }
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      deadline: "",
      customData: {}
    });
    setTaskDialogOpen(false);
    toast.success("Tâche créée avec succès");
  };

  const getEmployeeById = (id: string) => subordinates.find(emp => emp.id === id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_cours": return "bg-blue-100 text-blue-800";
      case "termine": return "bg-green-100 text-green-800";
      case "en_attente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_cours": return "En cours";
      case "termine": return "Terminé";
      case "en_attente": return "En attente";
      default: return "Non défini";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgente": return "bg-red-100 text-red-800";
      case "Haute": return "bg-orange-100 text-orange-800";
      case "Normale": return "bg-blue-100 text-blue-800";
      case "Basse": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Tâches et Projets</h3>
          <p className="text-sm text-gray-600">
            Assignez et suivez les tâches de votre équipe
          </p>
        </div>
        <div className="flex gap-2">
          <TaskColumnManager 
            columns={customColumns} 
            onColumnsChange={setCustomColumns}
          />
          <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle tâche</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Titre de la tâche</Label>
                  <Input 
                    placeholder="Titre..." 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Description détaillée..." 
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Assigné à</Label>
                  <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      {subordinates.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date limite</Label>
                  <Input 
                    type="date" 
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
                
                {/* Colonnes personnalisées */}
                {customColumns.map(column => (
                  <div key={column.id}>
                    <Label>{column.label} {column.required && "*"}</Label>
                    {column.type === "text" && (
                      <Input 
                        placeholder={column.label} 
                        value={newTask.customData[column.id] || ""}
                        onChange={(e) => setNewTask({
                          ...newTask, 
                          customData: {...newTask.customData, [column.id]: e.target.value}
                        })}
                      />
                    )}
                    {column.type === "select" && (
                      <Select 
                        value={newTask.customData[column.id] || ""} 
                        onValueChange={(value) => setNewTask({
                          ...newTask, 
                          customData: {...newTask.customData, [column.id]: value}
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Sélectionner ${column.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {column.options?.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {column.type === "date" && (
                      <Input 
                        type="date" 
                        value={newTask.customData[column.id] || ""}
                        onChange={(e) => setNewTask({
                          ...newTask, 
                          customData: {...newTask.customData, [column.id]: e.target.value}
                        })}
                      />
                    )}
                    {column.type === "number" && (
                      <Input 
                        type="number" 
                        placeholder={column.label} 
                        value={newTask.customData[column.id] || ""}
                        onChange={(e) => setNewTask({
                          ...newTask, 
                          customData: {...newTask.customData, [column.id]: e.target.value}
                        })}
                      />
                    )}
                  </div>
                ))}
                
                <Button className="w-full" onClick={handleCreateTask}>Créer la tâche</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Liste des tâches */}
      <Card>
        <CardHeader>
          <CardTitle>Tâches assignées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map(task => {
              const employee = getEmployeeById(task.assignedTo);
              if (!employee) return null;

              return (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusLabel(task.status)}
                        </Badge>
                        {task.customData.priority && (
                          <Badge className={getPriorityColor(task.customData.priority)}>
                            {task.customData.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {task.deadline}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="text-xs">
                          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{employee.name}</span>
                    </div>
                    
                    {/* Colonnes personnalisées */}
                    {customColumns.map(column => {
                      const value = task.customData[column.id];
                      if (!value) return null;
                      
                      return (
                        <div key={column.id} className="text-sm">
                          <span className="text-gray-500">{column.label}: </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
