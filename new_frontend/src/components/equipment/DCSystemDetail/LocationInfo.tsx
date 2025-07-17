
import { DCSystem } from "@/types/dcSystem";
import { MapPin } from "lucide-react";

interface LocationInfoProps {
  system: DCSystem;
}

export function LocationInfo({ system }: LocationInfoProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4" /> Emplacement
      </h3>
      <p className="text-sm">{system.location}</p>
      <p className="text-sm text-muted-foreground">Modèle: {system.model}</p>
    </div>
  );
}
