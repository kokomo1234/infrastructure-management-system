import { Calendar, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Maintenance = () => {
  // Mock maintenance data
  const upcomingMaintenance = [
    {
      id: 1,
      equipment: 'UPS-DATACENTER-01',
      site: 'Site TDL T1',
      type: 'Maintenance préventive',
      date: '2025-07-25',
      priority: 'medium',
      technician: 'Jean Dupont',
    },
    {
      id: 2,
      equipment: 'OND-BACKUP-02',
      site: 'Site TDL T1',
      type: 'Remplacement batterie',
      date: '2025-07-22',
      priority: 'high',
      technician: 'Marie Martin',
    },
    {
      id: 3,
      equipment: 'HVAC-COOLING-01',
      site: 'Site TDL T2',
      type: 'Nettoyage filtres',
      date: '2025-07-30',
      priority: 'low',
      technician: 'Pierre Durand',
    },
  ];

  const maintenanceStats = {
    scheduled: 12,
    overdue: 2,
    completed_this_month: 8,
    upcoming_this_week: 3,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Élevé';
      case 'medium': return 'Moyen';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance</h1>
          <p className="text-gray-600 mt-2">
            Planification et suivi des maintenances préventives
          </p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Planifier maintenance
        </Button>
      </div>

      {/* Maintenance stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planifiées</p>
                <p className="text-2xl font-bold">{maintenanceStats.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-red-600">{maintenanceStats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cette semaine</p>
                <p className="text-2xl font-bold text-yellow-600">{maintenanceStats.upcoming_this_week}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminées ce mois</p>
                <p className="text-2xl font-bold text-green-600">{maintenanceStats.completed_this_month}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenances à venir</CardTitle>
          <CardDescription>
            Prochaines interventions planifiées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMaintenance.map((maintenance) => (
              <div key={maintenance.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Wrench className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{maintenance.equipment}</h4>
                    <p className="text-sm text-gray-600">{maintenance.site}</p>
                    <p className="text-sm text-gray-500">{maintenance.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(maintenance.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-500">{maintenance.technician}</p>
                  </div>
                  
                  <Badge className={getPriorityColor(maintenance.priority)}>
                    {getPriorityText(maintenance.priority)}
                  </Badge>
                  
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance calendar placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Calendrier de maintenance</CardTitle>
          <CardDescription>
            Vue mensuelle des interventions planifiées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Calendrier de maintenance</p>
              <p className="text-sm text-gray-500">Fonctionnalité à venir</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maintenance;
