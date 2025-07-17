
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">
          Configuration du système et préférences utilisateur.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres du compte</CardTitle>
          <CardDescription>Gérez vos préférences personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-12 text-muted-foreground">
            Options de configuration à venir
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
