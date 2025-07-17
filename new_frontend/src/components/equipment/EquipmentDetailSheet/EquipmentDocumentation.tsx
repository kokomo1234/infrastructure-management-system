
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Settings, Wrench } from "lucide-react";

export function EquipmentDocumentation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Manuel d'utilisation
          </Button>
          <Button variant="outline" className="justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Fiche technique
          </Button>
          <Button variant="outline" className="justify-start">
            <Wrench className="mr-2 h-4 w-4" />
            Procédures de maintenance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
