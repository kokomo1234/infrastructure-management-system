import { useQuery } from '@tanstack/react-query';
import { Building2, Wrench, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';
import { formatCapacity, getStatusColor, calculateUtilization, getUtilizationColor } from '@/lib/utils';

const Dashboard = () => {
  // Fetch data from backend
  const { data: tdlSites, isLoading: tdlLoading } = useQuery({
    queryKey: ['tdl-sites'],
    queryFn: () => apiService.getTDLSites().then(res => res.data),
  });

  const { data: acEquipment, isLoading: acLoading } = useQuery({
    queryKey: ['ac-equipment'],
    queryFn: () => apiService.getACEquipment().then(res => res.data),
  });

  const { data: workOrders, isLoading: workOrdersLoading } = useQuery({
    queryKey: ['work-orders'],
    queryFn: () => apiService.getWorkOrders().then(res => res.data),
    retry: false, // Work orders might not exist yet
  });

  // Calculate metrics
  const totalSites = tdlSites?.length || 0;
  const totalEquipment = acEquipment?.length || 0;
  const activeSites = tdlSites?.filter(site => site.status === 'Actif').length || 0;
  const totalCapacity = tdlSites?.reduce((sum, site) => sum + (site.total_capacity_kw || 0), 0) || 0;
  const usedCapacity = tdlSites?.reduce((sum, site) => sum + (site.used_capacity_kw || 0), 0) || 0;
  const utilizationPercentage = calculateUtilization(usedCapacity, totalCapacity);

  // Recent alerts (mock data for now)
  const recentAlerts = [
    { id: 1, site: 'Site TDL T1', message: 'Utilisation élevée (85%)', severity: 'warning', time: '2h' },
    { id: 2, site: 'Site TDL T2', message: 'Maintenance programmée', severity: 'info', time: '4h' },
    { id: 3, site: 'Site TDL T3', message: 'Équipement redondant actif', severity: 'success', time: '6h' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (tdlLoading || acLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="loading-skeleton h-4 w-20 mb-2"></div>
                <div className="loading-skeleton h-8 w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de votre infrastructure
        </p>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites totaux</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSites}</div>
            <p className="text-xs text-muted-foreground">
              {activeSites} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipements</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquipment}</div>
            <p className="text-xs text-muted-foreground">
              AC/UPS/OND
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacité totale</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCapacity(totalCapacity)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCapacity(usedCapacity)} utilisés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisation</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUtilizationColor(utilizationPercentage)}`}>
              {utilizationPercentage}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  utilizationPercentage >= 90 ? 'bg-red-500' :
                  utilizationPercentage >= 75 ? 'bg-orange-500' :
                  utilizationPercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sites overview */}
        <Card>
          <CardHeader>
            <CardTitle>Sites récents</CardTitle>
            <CardDescription>
              État des sites principaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tdlSites?.slice(0, 5).map((site) => (
                <div key={site.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">{site.name}</p>
                      <p className="text-xs text-gray-500">{site.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCapacity(site.total_capacity_kw)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes récentes</CardTitle>
            <CardDescription>
              Notifications et événements importants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'warning' ? 'bg-yellow-500' :
                    alert.severity === 'info' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.site}
                    </p>
                    <p className="text-sm text-gray-600">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Il y a {alert.time}
                    </p>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity === 'critical' ? 'Critique' :
                     alert.severity === 'warning' ? 'Attention' :
                     alert.severity === 'info' ? 'Info' : 'OK'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
