
import React from "react";
import { SiteType, TDLType } from "@/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TDLDetailViewProps {
  site: SiteType;
  onBack: () => void;
  getStatusColor: (status: string) => string;
}

const TDLDetailView: React.FC<TDLDetailViewProps> = ({
  site,
  onBack,
  getStatusColor
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux sites
          </Button>
          <h3 className="text-lg font-medium">TDLs pour {site.name}</h3>
        </div>
        <Badge variant="outline" className={getStatusColor(site.status)}>
          {site.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du complexe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p className="text-sm">
                {site.address}, {site.city}, {site.postalCode}, {site.province}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Classe</p>
              <p className="text-sm">{site.class}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Phase</p>
              <p className="text-sm">{site.phase}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tension</p>
              <p className="text-sm">{site.voltage}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Facteur de puissance</p>
              <p className="text-sm">{site.powerFactor}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Équipements</p>
              <p className="text-sm">{site.equipmentCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des TDLs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Tension</TableHead>
                <TableHead>Facteur de puissance</TableHead>
                <TableHead className="text-center">Équipements</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {site.tdls.map(tdl => (
                <TableRow key={tdl.id}>
                  <TableCell className="font-medium">{tdl.name}</TableCell>
                  <TableCell>{tdl.phase}</TableCell>
                  <TableCell>{tdl.voltage}</TableCell>
                  <TableCell>{tdl.powerFactor}</TableCell>
                  <TableCell className="text-center">{tdl.equipmentCount}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {site.tdls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">Aucun TDL trouvé</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TDLDetailView;
