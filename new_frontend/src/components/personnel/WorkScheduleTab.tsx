
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Clock, Calendar as CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getSubordinates } from "@/lib/hierarchyService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Schedule {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export function WorkScheduleTab() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    employeeId: "",
    date: "",
    startTime: "",
    endTime: ""
  });

  const subordinates = getSubordinates(user?.id || "");

  // Mock data pour les horaires
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: "1", employeeId: "3", date: "2024-01-15", startTime: "08:00", endTime: "17:00", status: "scheduled" },
    { id: "2", employeeId: "4", date: "2024-01-15", startTime: "09:00", endTime: "18:00", status: "scheduled" },
    { id: "3", employeeId: "3", date: "2024-01-16", startTime: "08:00", endTime: "17:00", status: "completed" },
  ]);

  const getEmployeeById = (id: string) => subordinates.find(emp => emp.id === id);

  const handleAddSchedule = () => {
    if (!newSchedule.employeeId || !newSchedule.date || !newSchedule.startTime || !newSchedule.endTime) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const schedule: Schedule = {
      id: Date.now().toString(),
      employeeId: newSchedule.employeeId,
      date: newSchedule.date,
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      status: "scheduled"
    };

    setSchedules(prev => [...prev, schedule]);
    setNewSchedule({ employeeId: "", date: "", startTime: "", endTime: "" });
    setScheduleDialogOpen(false);
    toast.success("Horaire ajouté avec succès");
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Employé,Date,Heure début,Heure fin,Statut\n" +
      schedules.map(schedule => {
        const employee = getEmployeeById(schedule.employeeId);
        return `${employee?.name || 'N/A'},${schedule.date},${schedule.startTime},${schedule.endTime},${schedule.status}`;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "horaires.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export terminé");
  };

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sélectionner un employé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {subordinates.map(emp => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={viewMode} onValueChange={(value: "weekly" | "monthly") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Semaine</SelectItem>
              <SelectItem value="monthly">Mois</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter horaire
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Planifier un horaire</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Employé</Label>
                  <Select value={newSchedule.employeeId} onValueChange={(value) => setNewSchedule({...newSchedule, employeeId: value})}>
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
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Heure de début</Label>
                    <Input 
                      type="time" 
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Heure de fin</Label>
                    <Input 
                      type="time" 
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={handleAddSchedule}>Planifier</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Vue calendrier et liste */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendrier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Liste des horaires */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Horaires - {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : "Aujourd'hui"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.map(schedule => {
                  const employee = getEmployeeById(schedule.employeeId);
                  if (!employee) return null;

                  return (
                    <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                        <Badge variant={schedule.status === 'completed' ? 'default' : 'secondary'}>
                          {schedule.status === 'completed' ? 'Terminé' : 'Planifié'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
