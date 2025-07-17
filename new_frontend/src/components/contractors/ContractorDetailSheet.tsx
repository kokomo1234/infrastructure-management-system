
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Phone, Mail, Users, FileText, AlertTriangle } from "lucide-react";

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

interface ContractorDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractor: Contractor | null;
}

export function ContractorDetailSheet({ open, onOpenChange, contractor }: ContractorDetailSheetProps) {
  if (!contractor) return null;

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Building2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <SheetTitle className="text-2xl">{contractor.company}</SheetTitle>
              <SheetDescription className="text-base">
                Entrepreneur - {contractor.region}
              </SheetDescription>
            </div>
            <Badge className={getStatusColor(contractor.status)}>
              {contractor.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Compagnie</p>
                <p className="font-semibold">{contractor.company}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro SAP</p>
                <p className="font-semibold">{contractor.sapNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Région</p>
                <p className="font-semibold">{contractor.region}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <Badge className={getStatusColor(contractor.status)}>
                  {contractor.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Adresse complète</p>
                <p className="font-semibold">
                  {contractor.address}<br />
                  {contractor.city}, {contractor.province} {contractor.postalCode}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ville</p>
                <p className="font-semibold">{contractor.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Province</p>
                <p className="font-semibold">{contractor.province}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Code postal</p>
                <p className="font-semibold">{contractor.postalCode}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro service</p>
                <p className="font-semibold">{contractor.serviceNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Courriel</p>
                <p className="font-semibold">{contractor.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact d'urgence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Contact d'urgence
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Personne d'urgence</p>
                <p className="font-semibold">{contractor.emergencyContact}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone d'urgence</p>
                <p className="font-semibold">{contractor.emergencyPhone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Types de service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Types de service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {contractor.serviceTypes.map((type, index) => (
                  <Badge key={index} className={getServiceTypeColor(type)}>
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Équipements assignés (mock data) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Équipements assignés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">UPS-MTL-002</p>
                    <p className="text-sm text-gray-500">Centrale Montréal</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">UPS</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">UAC-SHE-001</p>
                    <p className="text-sm text-gray-500">Centre Sherbrooke</p>
                  </div>
                  <Badge className="bg-cyan-100 text-cyan-800">Mécanique</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contrats récents (mock data) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contrats récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Maintenance préventive UPS</p>
                    <p className="text-sm text-gray-500">Du 2024-01-01 au 2024-12-31</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Réparation système climatisation</p>
                    <p className="text-sm text-gray-500">Complété le 2024-11-15</p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Voir l'historique
          </Button>
          <Button variant="outline" className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Envoyer un courriel
          </Button>
          <Button variant="outline" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Appeler
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
