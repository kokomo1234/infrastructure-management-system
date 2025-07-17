
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  FolderPlus,
  Map, 
  MoreHorizontal, 
  Trash 
} from "lucide-react";
import { SiteType, TDLType } from "@/types/site";

interface SiteListProps {
  filteredSites: SiteType[];
  expandedSites: string[];
  toggleSiteExpansion: (siteId: string) => void;
  isSiteExpanded: (siteId: string) => boolean;
  handleAddTdl: (complexId: string) => void;
  handleEditSite: (site: SiteType) => void;
  getStatusColor: (status: string) => string;
}

const SiteList: React.FC<SiteListProps> = ({
  filteredSites,
  expandedSites,
  toggleSiteExpansion,
  isSiteExpanded,
  handleAddTdl,
  handleEditSite,
  getStatusColor
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] text-center"></TableHead>
          <TableHead>Complexe / TDL</TableHead>
          <TableHead>Adresse</TableHead>
          <TableHead>Ville</TableHead>
          <TableHead>Code postal</TableHead>
          <TableHead>Province</TableHead>
          <TableHead>Classe</TableHead>
          <TableHead className="text-center">Phase</TableHead>
          <TableHead className="text-center">Tension</TableHead>
          <TableHead className="text-center">FP</TableHead>
          <TableHead className="text-center">Équipements</TableHead>
          <TableHead className="text-center">Statut</TableHead>
          <TableHead className="w-[80px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSites.length > 0 ? (
          filteredSites.map(site => (
            <React.Fragment key={site.id}>
              <TableRow>
                <TableCell className="text-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 p-0"
                    onClick={() => toggleSiteExpansion(site.id)}
                  >
                    {isSiteExpanded(site.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle TDL</span>
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell>{site.address}</TableCell>
                <TableCell>{site.city}</TableCell>
                <TableCell>{site.postalCode}</TableCell>
                <TableCell>{site.province}</TableCell>
                <TableCell>{site.class}</TableCell>
                <TableCell className="text-center">{site.phase}</TableCell>
                <TableCell className="text-center">{site.voltage}</TableCell>
                <TableCell className="text-center">{site.powerFactor}</TableCell>
                <TableCell className="text-center">{site.equipmentCount}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={getStatusColor(site.status)}>
                    {site.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditSite(site)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddTdl(site.id)}>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        <span>Ajouter TDL</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Map className="mr-2 h-4 w-4" />
                        <span>Voir sur la carte</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              
              {isSiteExpanded(site.id) && site.tdls.map(tdl => (
                <TableRow key={tdl.id} className="bg-slate-50">
                  <TableCell></TableCell>
                  <TableCell className="pl-9 text-sm font-normal text-muted-foreground">
                    {tdl.name}
                  </TableCell>
                  <TableCell>{site.address}</TableCell>
                  <TableCell>{site.city}</TableCell>
                  <TableCell>{site.postalCode}</TableCell>
                  <TableCell>{site.province}</TableCell>
                  <TableCell>{site.class}</TableCell>
                  <TableCell className="text-center">{tdl.phase}</TableCell>
                  <TableCell className="text-center">{tdl.voltage}</TableCell>
                  <TableCell className="text-center">{tdl.powerFactor}</TableCell>
                  <TableCell className="text-center">{tdl.equipmentCount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={13} className="h-24 text-center">
              Aucun site trouvé.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SiteList;
