
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, Plus, Phone, Mail, MapPin, MoreHorizontal, Edit, Trash } from "lucide-react";
import { contractorColumns, mockContractors } from "@/lib/contractorColumns";
import { ContractorDetailSheet } from "@/components/contractors/ContractorDetailSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Contractor {
  id: string;
  company: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  region: string;
  email: string;
  serviceNumber: string;
  serviceTypes: string[];
  emergencyContact: string;
  emergencyPhone: string;
  sapNumber: string;
  status: string;
}

const Contractors = () => {
  const [contractors] = useState<Contractor[]>(mockContractors);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const filteredContractors = contractors.filter(contractor =>
    contractor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.serviceTypes.some(type => 
      type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif": return "bg-green-100 text-green-800";
      case "Inactif": return "bg-red-100 text-red-800";
      case "Suspendu": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "Mécanique": "bg-cyan-100 text-cyan-800",
      "UPS": "bg-blue-100 text-blue-800",
      "Système DC": "bg-green-100 text-green-800",
      "TSW": "bg-purple-100 text-purple-800",
      "Incendie": "bg-red-100 text-red-800",
      "Generatrice": "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const handleContractorClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setDetailSheetOpen(true);
  };

  const renderActionMenu = (contractor: Contractor) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleContractorClick(contractor)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Voir détails</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Phone className="mr-2 h-4 w-4" />
            <span>Appeler</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4" />
            <span>Envoyer courriel</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            <span>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Entrepreneurs</h2>
        <p className="text-muted-foreground">
          Gérez les entrepreneurs et fournisseurs de services.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un entrepreneur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un entrepreneur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Liste des entrepreneurs ({filteredContractors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContractors.map((contractor) => (
              <div
                key={contractor.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleContractorClick(contractor)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{contractor.company}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {contractor.city}, {contractor.region}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {contractor.serviceNumber}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contractor.email}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {contractor.serviceTypes.map((type, index) => (
                        <Badge key={index} variant="secondary" className={getServiceTypeColor(type)}>
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(contractor.status)}>
                    {contractor.status}
                  </Badge>
                  <div onClick={(e) => e.stopPropagation()}>
                    {renderActionMenu(contractor)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ContractorDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        contractor={selectedContractor}
      />
    </div>
  );
};

export default Contractors;
