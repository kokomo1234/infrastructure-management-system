
import React, { useState } from "react";
import { SiteType } from "@/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Settings } from "lucide-react";

interface SiteDetailViewProps {
  site: SiteType;
  onBack: () => void;
  getStatusColor: (status: string) => string;
}

const SiteDetailView: React.FC<SiteDetailViewProps> = ({ site, onBack, getStatusColor }) => {
  const [emergencyPercentage, setEmergencyPercentage] = useState(site.emergencyPercentage || 80);
  
  // Calculate total generator capacity (excluding redundant)
  const totalGeneratorCapacity = site.generators?.reduce((total, gen) => {
    return gen.isRedundant ? total : total + gen.capacity;
  }, 0) || 0;
  
  // Calculate emergency capacity
  const emergencyCapacity = (site.totalCapacityKW || 0) * (emergencyPercentage / 100);
  
  // Calculate utilization percentage
  const utilizationPercentage = site.totalCapacityKW ? 
    Math.round((site.usedCapacityKW || 0) / site.totalCapacityKW * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with search bar and site info */}
      <Card>
        <CardHeader className="bg-slate-50 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={onBack} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour
              </Button>
              
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Rechercher des sites..." 
                  className="pl-8 w-full" 
                />
              </div>
            </div>

            <div className="space-y-1 md:text-right">
              <CardTitle className="text-xl flex items-center justify-between">
                {site.name}
                <Badge variant="outline" className={getStatusColor(site.status)}>
                  {site.status}
                </Badge>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {site.address}, {site.city} | Classe: {site.class}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="bg-slate-100 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Capacité totale</div>
              <div className="text-lg font-semibold">{site.totalCapacityKW || 0} KW</div>
            </div>
            <div className="bg-slate-100 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Capacité utilisée</div>
              <div className="text-lg font-semibold">{site.usedCapacityKW || 0} KW</div>
            </div>
            <div className="bg-slate-100 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">% d'utilisation</div>
              <div className="text-lg font-semibold">{utilizationPercentage}%</div>
            </div>
            <div className="bg-slate-100 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Capacité restante</div>
              <div className="text-lg font-semibold">{(site.remainingCapacityKW || 0)} KW</div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="default" onClick={() => {}}>
              Visualiser les TDLs
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      {/* Building Capacity Information */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Capacité du bâtiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tension d'entrée:</span>
                  <span>{site.inputVoltage || "347/600V"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Courant d'entrée:</span>
                  <span>{site.inputCurrent || "400A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">% d'urgence:</span>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      className="w-20 text-right"
                      value={emergencyPercentage}
                      onChange={(e) => setEmergencyPercentage(Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Capacité d'urgence:</span>
                  <span>{emergencyCapacity.toFixed(2)} KW</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Generators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Génératrices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Capacité (KW)</TableHead>
                  <TableHead>TSW</TableHead>
                  <TableHead>Redondant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {site.generators && site.generators.length > 0 ? (
                  site.generators.map(gen => (
                    <TableRow key={gen.id}>
                      <TableCell>{gen.name}</TableCell>
                      <TableCell>{gen.capacity}</TableCell>
                      <TableCell>{gen.tswName}</TableCell>
                      <TableCell>
                        {gen.isRedundant ? 
                          <Badge variant="success">Oui</Badge> : 
                          <Badge variant="outline">Non</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Aucune génératrice
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between items-center font-semibold">
              <span>Capacité totale des génératrices:</span>
              <span>{totalGeneratorCapacity} KW</span>
            </div>
          </CardContent>
        </Card>
        
        {/* TSW (Transfer Switch) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commutateurs de transfert (TSW)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Charge</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead>Redondant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {site.tsws && site.tsws.length > 0 ? (
                  site.tsws.map(tsw => (
                    <TableRow key={tsw.id}>
                      <TableCell>{tsw.name}</TableCell>
                      <TableCell>{tsw.capacity} KW</TableCell>
                      <TableCell>{tsw.currentLoad} KW</TableCell>
                      <TableCell>{tsw.capacity - tsw.currentLoad} KW</TableCell>
                      <TableCell>
                        {tsw.isRedundant ? 
                          <Badge variant="success">Oui</Badge> : 
                          <Badge variant="outline">Non</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Aucun commutateur de transfert
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Equipment Lists */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Air Conditioners */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Climatiseurs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>KW sensibles</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Redondant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {site.airConditioners && site.airConditioners.length > 0 ? (
                  site.airConditioners.map(ac => (
                    <TableRow key={ac.id}>
                      <TableCell>{ac.name}</TableCell>
                      <TableCell>{ac.sensibleKW}</TableCell>
                      <TableCell>{ac.pair}</TableCell>
                      <TableCell>
                        {ac.isRedundant ? 
                          <Badge variant="success">Oui</Badge> : 
                          <Badge variant="outline">Non</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Aucun climatiseur
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* UPS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">UPS</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Charge</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Redondant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {site.ups && site.ups.length > 0 ? (
                  site.ups.map(ups => (
                    <TableRow key={ups.id}>
                      <TableCell>{ups.name}</TableCell>
                      <TableCell>{ups.capacity} KW</TableCell>
                      <TableCell>{ups.currentLoad} KW</TableCell>
                      <TableCell>{ups.pair}</TableCell>
                      <TableCell>
                        {ups.isRedundant ? 
                          <Badge variant="success">Oui</Badge> : 
                          <Badge variant="outline">Non</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Aucun UPS
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* DC Systems */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Systèmes DC</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Capacité installée</TableHead>
                  <TableHead>Charge réelle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {site.dcSystems && site.dcSystems.length > 0 ? (
                  site.dcSystems.map(dc => (
                    <TableRow key={dc.id}>
                      <TableCell>{dc.name}</TableCell>
                      <TableCell>{dc.capacity} KW</TableCell>
                      <TableCell>{dc.installedCapacity} KW</TableCell>
                      <TableCell>{dc.actualLoad} KW</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Aucun système DC
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteDetailView;
