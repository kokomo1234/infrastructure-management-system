import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, MapPin, Zap, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiService, TDLSite, ACEquipment } from '@/lib/api';
import { formatCapacity, getStatusColor, calculateUtilization, getUtilizationColor } from '@/lib/utils';

const Sites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState<TDLSite | null>(null);

  // Fetch data from backend
  const { data: tdlSites, isLoading: tdlLoading } = useQuery({
    queryKey: ['sites', 'tdl-sites'],
    queryFn: () => apiService.getTDLSites(),
  });

  const { data: allACEquipment, isLoading: acLoading } = useQuery({
    queryKey: ['sites', 'ac-equipment'],
    queryFn: () => apiService.getACEquipment(),
  });

  // Filter sites based on search
  const filteredSites = tdlSites?.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.ville.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Get AC equipment for selected site
  const siteACEquipment = allACEquipment?.filter(eq => eq.TDL_id === selectedSite?.id) || [];

  const SiteCard = ({ site }: { site: TDLSite }) => {
    const utilization = calculateUtilization(site.used_capacity_kw, site.total_capacity_kw);
    const equipmentCount = allACEquipment?.filter(eq => eq.TDL_id === site.id).length || 0;

    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedSite(site)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{site.name}</CardTitle>
            <Badge className={getStatusColor(site.status)}>
              {site.status}
            </Badge>
          </div>
          <CardDescription className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {site.ville}, {site.region}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Capacité totale</p>
              <p className="font-semibold">{formatCapacity(site.total_capacity_kw)}</p>
            </div>
            <div>
              <p className="text-gray-600">Utilisation</p>
              <p className={`font-semibold ${getUtilizationColor(utilization)}`}>
                {utilization}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Équipements AC</p>
              <p className="font-semibold">{equipmentCount}</p>
            </div>
            <div>
              <p className="text-gray-600">Phase</p>
              <p className="font-semibold">{site.phase}</p>
            </div>
          </div>
          
          {/* Capacity bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Capacité utilisée</span>
              <span>{formatCapacity(site.used_capacity_kw)} / {formatCapacity(site.total_capacity_kw)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  utilization >= 90 ? 'bg-red-500' :
                  utilization >= 75 ? 'bg-orange-500' :
                  utilization >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(utilization, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Compact AC Equipment Card (as requested by user)
  const CompactACCard = ({ equipment }: { equipment: ACEquipment }) => (
    <div 
      className="equipment-card cursor-pointer"
      onClick={() => {
        // Navigate to equipment detail page (to be implemented)
        console.log('Navigate to equipment:', equipment.id);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {equipment.nom}
          </p>
          <p className="text-xs text-gray-500">
            {equipment.type}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {formatCapacity(equipment.output_ac / 1000)}
          </p>
        </div>
      </div>
    </div>
  );

  const SiteDetailModal = ({ site }: { site: TDLSite }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{site.name}</h2>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {site.adresse}, {site.ville} {site.code_postal}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(site.status)}>
                {site.status}
              </Badge>
              <Button variant="outline" onClick={() => setSelectedSite(null)}>
                Fermer
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Site Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du site</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Région</p>
                      <p className="font-semibold">{site.region}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Classe</p>
                      <p className="font-semibold">{site.class}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phase</p>
                      <p className="font-semibold">{site.phase}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tension</p>
                      <p className="font-semibold">{site.voltage}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Facteur de puissance</p>
                      <p className="font-semibold">{site.power_factor}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pourcentage d'urgence</p>
                      <p className="font-semibold">{site.emergency_percentage}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compact AC Equipment Section (as requested) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Équipements AC ({siteACEquipment.length})
                  </CardTitle>
                  <CardDescription>
                    Équipements d'alimentation et onduleurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {siteACEquipment.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {siteACEquipment.map((equipment) => (
                        <CompactACCard key={equipment.id} equipment={equipment} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun équipement AC trouvé</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Capacity and Metrics */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Capacité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Capacité totale</span>
                        <span className="font-semibold">{formatCapacity(site.total_capacity_kw)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Capacité utilisée</span>
                        <span className="font-semibold">{formatCapacity(site.used_capacity_kw)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Capacité restante</span>
                        <span className="font-semibold text-green-600">
                          {formatCapacity(site.remaining_capacity_kw)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            calculateUtilization(site.used_capacity_kw, site.total_capacity_kw) >= 90 ? 'bg-red-500' :
                            calculateUtilization(site.used_capacity_kw, site.total_capacity_kw) >= 75 ? 'bg-orange-500' :
                            calculateUtilization(site.used_capacity_kw, site.total_capacity_kw) >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min(calculateUtilization(site.used_capacity_kw, site.total_capacity_kw), 100)}%` 
                          }}
                        ></div>
                      </div>
                      
                      <p className="text-center text-sm text-gray-600 mt-2">
                        {calculateUtilization(site.used_capacity_kw, site.total_capacity_kw)}% utilisé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Charges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Charge AC</span>
                      <span className="font-semibold">{site.charge_ac} W</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Charge DC</span>
                      <span className="font-semibold">{site.charge_dc} W</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Charge générateur</span>
                      <span className="font-semibold">{site.charge_gen} W</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Charge climatisation</span>
                      <span className="font-semibold">{site.charge_clim} W</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (tdlLoading || acLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Sites</h1>
          <p className="text-gray-600 mt-2">
            Gestion des sites TDL et de leur infrastructure
          </p>
        </div>
        <Button>
          <Building2 className="h-4 w-4 mr-2" />
          Nouveau site
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher des sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Sites grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>

      {filteredSites.length === 0 && !tdlLoading && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun site trouvé
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Essayez de modifier votre recherche.' : 'Commencez par créer votre premier site.'}
          </p>
        </div>
      )}

      {/* Site detail modal */}
      {selectedSite && <SiteDetailModal site={selectedSite} />}
    </div>
  );
};

export default Sites;
