import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wrench, Search, Filter, Plus, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiService, ACEquipment } from '@/lib/api';
import { formatCapacity, getStatusColor } from '@/lib/utils';

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Fetch data from backend
  const { data: acEquipment, isLoading: acLoading } = useQuery({
    queryKey: ['equipment', 'ac-equipment'],
    queryFn: () => apiService.getACEquipment(),
  });

  const { data: tdlSites, isLoading: tdlLoading } = useQuery({
    queryKey: ['equipment', 'tdl-sites'],
    queryFn: () => apiService.getTDLSites(),
  });

  // Filter equipment based on search and type
  const filteredEquipment = acEquipment?.filter(equipment => {
    const matchesSearch = equipment.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || equipment.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  }) || [];

  // Get unique equipment types
  const equipmentTypes = [...new Set(acEquipment?.map(eq => eq.type) || [])];

  const getSiteName = (tdlId?: number) => {
    if (!tdlId) return 'Non assigné';
    const site = tdlSites?.find(site => site.id === tdlId);
    return site?.name || `Site ${tdlId}`;
  };

  const getEquipmentStatus = (equipment: ACEquipment) => {
    if (equipment.OOD) return 'Hors service';
    if (equipment.current_load && equipment.output_ac) {
      const utilization = (equipment.current_load / equipment.output_ac) * 100;
      if (utilization > 90) return 'Charge élevée';
      if (utilization > 75) return 'Charge moyenne';
    }
    return 'Opérationnel';
  };

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'Hors service': return 'text-red-600 bg-red-100';
      case 'Charge élevée': return 'text-orange-600 bg-orange-100';
      case 'Charge moyenne': return 'text-yellow-600 bg-yellow-100';
      case 'Opérationnel': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const EquipmentCard = ({ equipment }: { equipment: ACEquipment }) => {
    const status = getEquipmentStatus(equipment);
    const utilization = equipment.current_load && equipment.output_ac 
      ? Math.round((equipment.current_load / equipment.output_ac) * 100) 
      : 0;

    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{equipment.nom}</CardTitle>
            <Badge className={getEquipmentStatusColor(status)}>
              {status}
            </Badge>
          </div>
          <CardDescription className="flex items-center text-sm">
            <Building2 className="h-4 w-4 mr-1" />
            {getSiteName(equipment.TDL_id)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-semibold">{equipment.type}</p>
            </div>
            <div>
              <p className="text-gray-600">Capacité</p>
              <p className="font-semibold">{formatCapacity(equipment.output_ac / 1000)}</p>
            </div>
            <div>
              <p className="text-gray-600">Charge actuelle</p>
              <p className="font-semibold">{formatCapacity((equipment.current_load || 0) / 1000)}</p>
            </div>
            <div>
              <p className="text-gray-600">Utilisation</p>
              <p className={`font-semibold ${
                utilization > 90 ? 'text-red-600' :
                utilization > 75 ? 'text-orange-600' :
                utilization > 50 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {utilization}%
              </p>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              {equipment.manufacturer && (
                <div>
                  <p>Fabricant</p>
                  <p className="font-medium text-gray-900">{equipment.manufacturer}</p>
                </div>
              )}
              {equipment.modèle && (
                <div>
                  <p>Modèle</p>
                  <p className="font-medium text-gray-900">{equipment.modèle}</p>
                </div>
              )}
              {equipment.installation_date && (
                <div>
                  <p>Installation</p>
                  <p className="font-medium text-gray-900">
                    {new Date(equipment.installation_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              {equipment.is_redundant && (
                <div>
                  <p>Redondance</p>
                  <p className="font-medium text-green-600">Oui</p>
                </div>
              )}
            </div>
          </div>

          {/* Utilization bar */}
          {utilization > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Utilisation</span>
                <span>{utilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    utilization > 90 ? 'bg-red-500' :
                    utilization > 75 ? 'bg-orange-500' :
                    utilization > 50 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (acLoading || tdlLoading) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-8 w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="loading-skeleton h-6 w-32 mb-4"></div>
                <div className="loading-skeleton h-4 w-24 mb-2"></div>
                <div className="loading-skeleton h-16 w-full"></div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Équipements</h1>
          <p className="text-gray-600 mt-2">
            Gestion des équipements AC, UPS et onduleurs
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel équipement
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher des équipements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Type filter */}
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            Tous
          </Button>
          {equipmentTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Plus de filtres
        </Button>
      </div>

      {/* Equipment stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total équipements</p>
                <p className="text-2xl font-bold">{acEquipment?.length || 0}</p>
              </div>
              <Wrench className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Opérationnels</p>
                <p className="text-2xl font-bold text-green-600">
                  {acEquipment?.filter(eq => !eq.OOD).length || 0}
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hors service</p>
                <p className="text-2xl font-bold text-red-600">
                  {acEquipment?.filter(eq => eq.OOD).length || 0}
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Capacité totale</p>
                <p className="text-2xl font-bold">
                  {formatCapacity((acEquipment?.reduce((sum, eq) => sum + eq.output_ac, 0) || 0) / 1000)}
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((equipment) => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
      </div>

      {filteredEquipment.length === 0 && !acLoading && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun équipement trouvé
          </h3>
          <p className="text-gray-600">
            {searchTerm || selectedType !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche.' 
              : 'Commencez par ajouter votre premier équipement.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Equipment;
