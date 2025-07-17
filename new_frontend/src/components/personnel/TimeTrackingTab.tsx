
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getSubordinates } from "@/lib/hierarchyService";
import { useAuth } from "@/context/AuthContext";

interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'late' | 'absent' | 'partial';
  totalHours?: number;
}

export function TimeTrackingTab() {
  const { user } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");

  const subordinates = getSubordinates(user?.id || "");

  // Mock data pour les entrées de temps
  const timeEntries: TimeEntry[] = [
    {
      id: "1",
      employeeId: "3",
      date: "2024-01-15",
      checkIn: "08:00",
      checkOut: "17:00",
      status: "present",
      totalHours: 8
    },
    {
      id: "2",
      employeeId: "4",
      date: "2024-01-15",
      checkIn: "09:15",
      checkOut: "18:00",
      status: "late",
      totalHours: 7.75
    },
    {
      id: "3",
      employeeId: "3",
      date: "2024-01-16",
      checkIn: "08:00",
      checkOut: "12:00",
      status: "partial",
      totalHours: 4
    }
  ];

  const getEmployeeById = (id: string) => subordinates.find(emp => emp.id === id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Présent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Retard</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case 'partial':
        return <Badge className="bg-blue-100 text-blue-800">Partiel</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const filteredEntries = selectedEmployee === "all" 
    ? timeEntries 
    : timeEntries.filter(entry => entry.employeeId === selectedEmployee);

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

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter rapport
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{timeEntries.filter(e => e.status === 'present').length}</p>
                <p className="text-sm text-gray-600">Présences</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{timeEntries.filter(e => e.status === 'late').length}</p>
                <p className="text-sm text-gray-600">Retards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{timeEntries.filter(e => e.status === 'absent').length}</p>
                <p className="text-sm text-gray-600">Absences</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {timeEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0)}h
                </p>
                <p className="text-sm text-gray-600">Total heures</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des présences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Feuille de présence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.map(entry => {
              const employee = getEmployeeById(entry.employeeId);
              if (!employee) return null;

              return (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>
                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(entry.date), "EEEE d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-sm">
                      <p className="font-medium">Arrivée: {entry.checkIn}</p>
                      {entry.checkOut && (
                        <p className="text-gray-600">Départ: {entry.checkOut}</p>
                      )}
                    </div>
                    
                    {entry.totalHours && (
                      <div className="text-center">
                        <p className="text-lg font-bold">{entry.totalHours}h</p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(entry.status)}
                      {getStatusBadge(entry.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Résumé par employé */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé par employé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subordinates.map(employee => {
              const employeeEntries = timeEntries.filter(entry => entry.employeeId === employee.id);
              const totalHours = employeeEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
              const presentDays = employeeEntries.filter(entry => entry.status === 'present').length;
              const lateDays = employeeEntries.filter(entry => entry.status === 'late').length;

              return (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-lg font-bold">{totalHours}h</p>
                      <p className="text-gray-600">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{presentDays}</p>
                      <p className="text-gray-600">Présent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-yellow-600">{lateDays}</p>
                      <p className="text-gray-600">Retards</p>
                    </div>
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
