
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Clock, Plus } from "lucide-react";
import { TimeEntry, Task } from "@/types/project";

// Mock time entries
const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    taskId: "1",
    userId: "user1",
    hours: 2.5,
    description: "Inspection initiale des équipements",
    date: "2024-02-14",
    createdAt: "2024-02-14T10:30:00Z"
  },
  {
    id: "2",
    taskId: "1",
    userId: "user1",
    hours: 1.5,
    description: "Documentation des problèmes trouvés",
    date: "2024-02-14",
    createdAt: "2024-02-14T14:00:00Z"
  }
];

interface TimeTrackingProps {
  task: Task;
}

export function TimeTracking({ task }: TimeTrackingProps) {
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries.filter(entry => entry.taskId === task.id));
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    hours: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  // Timer functionality
  const startTimer = () => {
    setIsTracking(true);
    setStartTime(new Date());
  };

  const pauseTimer = () => {
    if (startTime) {
      const now = new Date();
      const elapsed = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60); // Convert to hours
      setCurrentTime(prev => prev + elapsed);
    }
    setIsTracking(false);
    setStartTime(null);
  };

  const stopTimer = () => {
    let finalTime = currentTime;
    if (startTime && isTracking) {
      const now = new Date();
      const elapsed = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      finalTime += elapsed;
    }

    if (finalTime > 0) {
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        taskId: task.id,
        userId: "user1", // Current user
        hours: Math.round(finalTime * 100) / 100, // Round to 2 decimal places
        description: "Temps suivi automatiquement",
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };

      setTimeEntries(prev => [newEntry, ...prev]);
    }

    setIsTracking(false);
    setCurrentTime(0);
    setStartTime(null);
  };

  const addManualEntry = () => {
    if (!manualEntry.hours || !manualEntry.date) return;

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId: task.id,
      userId: "user1",
      hours: parseFloat(manualEntry.hours),
      description: manualEntry.description || "Saisie manuelle",
      date: manualEntry.date,
      createdAt: new Date().toISOString()
    };

    setTimeEntries(prev => [newEntry, ...prev]);
    setAddEntryOpen(false);
    setManualEntry({
      hours: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const displayTime = currentTime + (isTracking && startTime ? 
    (new Date().getTime() - startTime.getTime()) / (1000 * 60 * 60) : 0);

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Suivi du temps
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Timer */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-2xl font-mono font-bold">
                {formatTime(displayTime)}
              </div>
              <div className="text-sm text-muted-foreground">
                {isTracking ? "En cours..." : "Arrêté"}
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isTracking ? (
                <Button onClick={startTimer} variant="default">
                  <Play className="h-4 w-4 mr-2" />
                  Démarrer
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="secondary">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button onClick={stopTimer} variant="outline" disabled={!isTracking && currentTime === 0}>
                <Square className="h-4 w-4 mr-2" />
                Arrêter
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded">
              <div className="text-lg font-semibold">{formatTime(totalHours)}</div>
              <div className="text-sm text-muted-foreground">Temps total</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded">
              <div className="text-lg font-semibold">
                {task.estimatedHours ? formatTime(task.estimatedHours) : "Non estimé"}
              </div>
              <div className="text-sm text-muted-foreground">Temps estimé</div>
            </div>
          </div>

          {task.estimatedHours && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>
                  {Math.round((totalHours / task.estimatedHours) * 100)}%
                  {totalHours > task.estimatedHours && (
                    <Badge variant="destructive" className="ml-2">Dépassé</Badge>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    totalHours > task.estimatedHours ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ 
                    width: `${Math.min((totalHours / task.estimatedHours) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Historique du temps</CardTitle>
            <Dialog open={addEntryOpen} onOpenChange={setAddEntryOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une entrée de temps</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Heures</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.25"
                      value={manualEntry.hours}
                      onChange={(e) => setManualEntry(prev => ({ ...prev, hours: e.target.value }))}
                      placeholder="Ex: 2.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={manualEntry.date}
                      onChange={(e) => setManualEntry(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Textarea
                      id="description"
                      value={manualEntry.description}
                      onChange={(e) => setManualEntry(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Qu'avez-vous fait pendant ce temps ?"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddEntryOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={addManualEntry}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {timeEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{formatTime(entry.hours)}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.description}
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
            
            {timeEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune entrée de temps enregistrée
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
