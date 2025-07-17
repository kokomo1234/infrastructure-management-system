
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Trash2, Zap } from "lucide-react";
import { Automation } from "@/types/project";

// Mock automation rules
const mockAutomations: Automation[] = [
  {
    id: "1",
    projectId: "1",
    name: "Notification fin de tâche",
    trigger: {
      type: "task_status_changed",
      conditions: { status: "completed" }
    },
    action: {
      type: "send_notification",
      parameters: { message: "Tâche terminée !" }
    },
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    projectId: "1",
    name: "Alerte tâche en retard",
    trigger: {
      type: "task_overdue",
      conditions: {}
    },
    action: {
      type: "change_status",
      parameters: { status: "overdue" }
    },
    isActive: true,
    createdAt: "2024-01-20T14:30:00Z"
  }
];

interface AutomationRulesProps {
  projectId: string;
}

export function AutomationRules({ projectId }: AutomationRulesProps) {
  const [automations, setAutomations] = useState(mockAutomations);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    triggerType: "",
    triggerCondition: "",
    actionType: "",
    actionParameter: ""
  });

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(automation =>
        automation.id === id
          ? { ...automation, isActive: !automation.isActive }
          : automation
      )
    );
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(automation => automation.id !== id));
  };

  const createAutomation = () => {
    if (!newAutomation.name || !newAutomation.triggerType || !newAutomation.actionType) {
      return;
    }

    const automation: Automation = {
      id: Date.now().toString(),
      projectId,
      name: newAutomation.name,
      trigger: {
        type: newAutomation.triggerType as any,
        conditions: newAutomation.triggerCondition ? { status: newAutomation.triggerCondition } : {}
      },
      action: {
        type: newAutomation.actionType as any,
        parameters: newAutomation.actionParameter ? { message: newAutomation.actionParameter } : {}
      },
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setAutomations(prev => [...prev, automation]);
    setCreateDialogOpen(false);
    setNewAutomation({
      name: "",
      triggerType: "",
      triggerCondition: "",
      actionType: "",
      actionParameter: ""
    });
  };

  const getTriggerText = (automation: Automation) => {
    switch (automation.trigger.type) {
      case 'task_status_changed':
        return `Quand le statut devient "${automation.trigger.conditions.status}"`;
      case 'task_assigned':
        return 'Quand une tâche est assignée';
      case 'task_overdue':
        return 'Quand une tâche est en retard';
      case 'task_created':
        return 'Quand une tâche est créée';
      default:
        return 'Déclencheur personnalisé';
    }
  };

  const getActionText = (automation: Automation) => {
    switch (automation.action.type) {
      case 'send_notification':
        return `Envoyer notification: "${automation.action.parameters.message}"`;
      case 'change_status':
        return `Changer le statut vers "${automation.action.parameters.status}"`;
      case 'assign_user':
        return `Assigner à l'utilisateur ${automation.action.parameters.userId}`;
      case 'add_comment':
        return `Ajouter commentaire: "${automation.action.parameters.comment}"`;
      default:
        return 'Action personnalisée';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automatisations
            </CardTitle>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle règle
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Créer une automatisation</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la règle</Label>
                    <Input
                      id="name"
                      value={newAutomation.name}
                      onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Notification fin de tâche"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Déclencheur (SI)</Label>
                    <Select 
                      value={newAutomation.triggerType} 
                      onValueChange={(value) => setNewAutomation(prev => ({ ...prev, triggerType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un déclencheur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task_status_changed">Statut de tâche change</SelectItem>
                        <SelectItem value="task_assigned">Tâche assignée</SelectItem>
                        <SelectItem value="task_overdue">Tâche en retard</SelectItem>
                        <SelectItem value="task_created">Tâche créée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newAutomation.triggerType === 'task_status_changed' && (
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Select 
                        value={newAutomation.triggerCondition} 
                        onValueChange={(value) => setNewAutomation(prev => ({ ...prev, triggerCondition: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Statut cible" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">À faire</SelectItem>
                          <SelectItem value="in-progress">En cours</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Action (ALORS)</Label>
                    <Select 
                      value={newAutomation.actionType} 
                      onValueChange={(value) => setNewAutomation(prev => ({ ...prev, actionType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send_notification">Envoyer notification</SelectItem>
                        <SelectItem value="change_status">Changer statut</SelectItem>
                        <SelectItem value="assign_user">Assigner utilisateur</SelectItem>
                        <SelectItem value="add_comment">Ajouter commentaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(newAutomation.actionType === 'send_notification' || newAutomation.actionType === 'add_comment') && (
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Input
                        value={newAutomation.actionParameter}
                        onChange={(e) => setNewAutomation(prev => ({ ...prev, actionParameter: e.target.value }))}
                        placeholder="Message à envoyer"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={createAutomation}>
                      Créer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {automations.map(automation => (
              <Card key={automation.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{automation.name}</h4>
                      <Badge variant={automation.isActive ? "default" : "secondary"}>
                        {automation.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">SI:</span>
                        <span>{getTriggerText(automation)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">ALORS:</span>
                        <span>{getActionText(automation)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={automation.isActive}
                      onCheckedChange={() => toggleAutomation(automation.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAutomation(automation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {automations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune automatisation configurée</p>
                <p className="text-sm">Créez votre première règle pour automatiser vos workflows</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
