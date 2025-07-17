
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Equipment {
  installDate: string;
  [key: string]: any;
}

interface EquipmentHistoryProps {
  equipment: Equipment;
}

export function EquipmentHistory({ equipment }: EquipmentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historique de maintenance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Maintenance préventive</span>
              <span className="text-sm text-muted-foreground">15/04/2023</span>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">Vérification générale et nettoyage</p>
          </div>
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Remplacement de pièce</span>
              <span className="text-sm text-muted-foreground">22/01/2023</span>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">Remplacement du ventilateur interne</p>
          </div>
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Installation</span>
              <span className="text-sm text-muted-foreground">
                {new Date(equipment.installDate).toLocaleDateString("fr-CA")}
              </span>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">Mise en service initiale</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
