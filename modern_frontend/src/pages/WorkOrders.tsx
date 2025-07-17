import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Plus, Search, Filter, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';
import { getPriorityColor, formatDateTime } from '@/lib/utils';

const WorkOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock work orders data since backend might not have this endpoint yet
  const mockWorkOrders = [
    {
      id: '1',
      title: 'Maintenance préventive UPS-DATACENTER-01',
      description: 'Vérification et nettoyage de l\'UPS principal',
      priority: 'medium' as const,
      status: 'open' as const,
      site_id: '1',
      site_name: 'Site TDL T1',
      equipment_type: 'UPS',
      created_at: new Date().toISOString(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'Jean Dupont',
    },
    {
      id: '2',
      title: 'Remplacement batterie OND-BACKUP-02',
      description: 'Remplacement des batteries de l\'onduleur de secours',
      priority: 'high' as const,
      status: 'in_progress' as const,
      site_id: '1',
      site_name: 'Site TDL T1',
      equipment_type: 'OND',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'Marie Martin',
    },
    {
      id: '3',
      title: 'Inspection annuelle Site T2',
      description: 'Inspection complète des équipements du site',
      priority: 'low' as const,
      status: 'completed' as const,
      site_id: '2',
      site_name: 'Site TDL T2',
      equipment_type: 'Général',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'Pierre Durand',
    },
  ];

  const workOrders = mockWorkOrders;

  // Filter work orders
  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.site_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || wo.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      case 'critical': return 'Critique';
      default: return priority;
    }
  };

  const WorkOrderCard = ({ workOrder }: { workOrder: typeof mockWorkOrders[0] }) => {
    const isOverdue = new Date(workOrder.due_date) < new Date() && workOrder.status !== 'completed';

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{workOrder.title}</CardTitle>
              <CardDescription className="mt-1">
                {workOrder.site_name} • {workOrder.equipment_type}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(workOrder.status)}>
                {getStatusText(workOrder.status)}
              </Badge>
              <Badge className={getPriorityColor(workOrder.priority)}>
                {getPriorityText(workOrder.priority)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {workOrder.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <div>
                <p className="text-xs">Échéance</p>
                <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDateTime(workOrder.due_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <div>
                <p className="text-xs">Assigné à</p>
                <p className="font-medium text-gray-900">{workOrder.assigned_to}</p>
              </div>
            </div>
          </div>

          {isOverdue && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-600 font-medium">
                ⚠️ En retard
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const statusOptions = [
    { value: 'all', label: 'Tous' },
    { value: 'open', label: 'Ouverts' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminés' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ordres de travail</h1>
          <p className="text-gray-600 mt-2">
            Gestion des tâches de maintenance et réparations
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel ordre de travail
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher des ordres de travail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Status filter */}
        <div className="flex items-center space-x-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedStatus === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Plus de filtres
        </Button>
      </div>

      {/* Work orders stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{workOrders.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ouverts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {workOrders.filter(wo => wo.status === 'open').length}
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {workOrders.filter(wo => wo.status === 'in_progress').length}
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-green-600">
                  {workOrders.filter(wo => wo.status === 'completed').length}
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work orders grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkOrders.map((workOrder) => (
          <WorkOrderCard key={workOrder.id} workOrder={workOrder} />
        ))}
      </div>

      {filteredWorkOrders.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun ordre de travail trouvé
          </h3>
          <p className="text-gray-600">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche.' 
              : 'Commencez par créer votre premier ordre de travail.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkOrders;
