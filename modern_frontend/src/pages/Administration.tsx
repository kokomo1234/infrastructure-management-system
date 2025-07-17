import { Shield, Users, Database, Settings, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Administration = () => {
  const systemStats = {
    total_users: 12,
    active_sessions: 8,
    database_size: '2.4 GB',
    last_backup: '2025-07-17T10:30:00Z',
    system_uptime: '99.8%',
  };

  const recentActivities = [
    {
      id: 1,
      user: 'Jean Dupont',
      action: 'Création d\'un nouvel équipement',
      timestamp: '2025-07-17T14:30:00Z',
      type: 'create',
    },
    {
      id: 2,
      user: 'Marie Martin',
      action: 'Modification du site TDL T1',
      timestamp: '2025-07-17T13:45:00Z',
      type: 'update',
    },
    {
      id: 3,
      user: 'Pierre Durand',
      action: 'Suppression d\'un ordre de travail',
      timestamp: '2025-07-17T12:15:00Z',
      type: 'delete',
    },
    {
      id: 4,
      user: 'Admin',
      action: 'Sauvegarde de la base de données',
      timestamp: '2025-07-17T10:30:00Z',
      type: 'system',
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create': return 'text-green-600 bg-green-100';
      case 'update': return 'text-blue-600 bg-blue-100';
      case 'delete': return 'text-red-600 bg-red-100';
      case 'system': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return '+';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'system': return '⚙️';
      default: return '•';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-2">
            Gestion du système et surveillance des activités
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Paramètres système
        </Button>
      </div>

      {/* System stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold">{systemStats.total_users}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions actives</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.active_sessions}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Base de données</p>
                <p className="text-2xl font-bold">{systemStats.database_size}</p>
              </div>
              <Database className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibilité</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.system_uptime}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dernière sauvegarde</p>
                <p className="text-sm font-bold">
                  {new Date(systemStats.last_backup).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activities */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>
              Dernières actions effectuées dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System management */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion du système</CardTitle>
            <CardDescription>
              Outils d'administration et maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Sauvegarde de la base de données</h4>
                  <p className="text-sm text-gray-600">Créer une sauvegarde complète</p>
                </div>
                <Button variant="outline" size="sm">
                  Sauvegarder
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Nettoyage des logs</h4>
                  <p className="text-sm text-gray-600">Supprimer les anciens journaux</p>
                </div>
                <Button variant="outline" size="sm">
                  Nettoyer
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Optimisation de la base</h4>
                  <p className="text-sm text-gray-600">Optimiser les performances</p>
                </div>
                <Button variant="outline" size="sm">
                  Optimiser
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Rapport d'utilisation</h4>
                  <p className="text-sm text-gray-600">Générer un rapport détaillé</p>
                </div>
                <Button variant="outline" size="sm">
                  Générer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration status */}
      <Card>
        <CardHeader>
          <CardTitle>État de la migration</CardTitle>
          <CardDescription>
            Statut de la migration de la base de données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium text-green-900">Migration terminée avec succès</p>
                <p className="text-sm text-green-700">
                  Base de données migrée vers le nouveau schéma avec 27 colonnes TDL et 37 colonnes AC
                </p>
              </div>
            </div>
            <Badge className="text-green-600 bg-green-100">
              Terminé
            </Badge>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-900">3</p>
              <p className="text-gray-600">Sites TDL</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-900">2</p>
              <p className="text-gray-600">Équipements AC</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-900">2</p>
              <p className="text-gray-600">Nouvelles tables</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Administration;
