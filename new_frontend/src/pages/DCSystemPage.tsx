
import { DCSystemOverview } from "@/components/dc-system/DCSystemOverview";

export default function DCSystemPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Système d'alimentation DC</h2>
        <p className="text-muted-foreground">
          Gestion et supervision du système d'alimentation à courant continu
        </p>
      </div>
      
      <DCSystemOverview />
    </div>
  );
}
