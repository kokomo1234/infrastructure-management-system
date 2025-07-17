import React from "react";
import { SiteType } from "@/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FolderPlus, 
  Eye, 
  MoreHorizontal, 
  Edit, 
  MapPin, 
  ListFilter 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SiteGridProps {
  sites: SiteType[];
  getStatusColor: (status: string) => string;
  handleAddTdl: (complexId: string) => void;
  handleEditSite: (site: SiteType) => void;
  onViewTDLDetails: (site: SiteType) => void;
  onViewSiteDetails: (site: SiteType) => void;
}

const SiteGrid: React.FC<SiteGridProps> = ({
  sites,
  getStatusColor,
  handleAddTdl,
  handleEditSite,
  onViewTDLDetails,
  onViewSiteDetails
}) => {
  return (
    <div className="space-y-6">
      {sites.map(site => (
        <Card 
          key={site.id} 
          className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border-slate-200 bg-white"
        >
          <CardHeader className="bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-slate-800 tracking-tight">
                {site.name}
              </CardTitle>
              <div className="text-sm text-slate-600 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                {site.address}, {site.city}, {site.province}
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(site.status)} font-medium`}
            >
              {site.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Informations générales */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-700">Informations générales</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Code postal:</span>
                      <span className="text-sm font-medium">{site.postalCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Classe:</span>
                      <span className="text-sm font-medium">{site.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Phase:</span>
                      <span className="text-sm font-medium">{site.phase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tension:</span>
                      <span className="text-sm font-medium">{site.voltage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Facteur de puissance:</span>
                      <span className="text-sm font-medium">{site.powerFactor}</span>
                    </div>
                  </div>
                </div>

                {/* Équipements */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-700">Équipements</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total:</span>
                      <span className="text-sm font-medium">{site.equipmentCount} équipements</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">TDLs:</span>
                      <span className="text-sm font-medium">{site.tdls.length}</span>
                    </div>
                  </div>
                  
                  {site.tdls.length > 0 && (
                    <Accordion type="single" collapsible className="w-full mt-4">
                      <AccordionItem value="tdls">
                        <AccordionTrigger className="text-sm font-medium">
                          Voir les TDLs
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {site.tdls.map(tdl => (
                              <li key={tdl.id} className="text-sm border-l-2 border-slate-200 pl-3">
                                <span className="font-medium">{tdl.name}</span>
                                <div className="text-xs text-muted-foreground">
                                  {tdl.equipmentCount} équipements | {tdl.phase} | {tdl.voltage}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>

                {/* DC Systems section */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-700">Systèmes alimentation</h3>
                  <div className="text-sm text-muted-foreground">
                    {site.dcSystems?.length ? 
                      `${site.dcSystems.length} systèmes DC` : 
                      "Aucun système d'alimentation associé."
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={() => onViewSiteDetails(site)}
                  >
                    <ListFilter className="mr-2 h-4 w-4" />
                    Voir détails du site
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={() => onViewTDLDetails(site)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Voir détails TDLs
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => handleAddTdl(site.id)}
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Ajouter TDL
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-slate-300">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white shadow-lg">
                      <DropdownMenuItem 
                        onClick={() => handleEditSite(site)}
                        className="hover:bg-slate-100 cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {sites.length === 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-center h-24 bg-slate-50">
            <p className="text-slate-500 text-center">Aucun site trouvé.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SiteGrid;
