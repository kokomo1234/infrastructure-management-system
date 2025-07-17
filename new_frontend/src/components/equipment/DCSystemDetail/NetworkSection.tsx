
import { DCSystem } from "@/types/dcSystem";
import { Network } from "lucide-react";

interface NetworkSectionProps {
  system: DCSystem;
}

export function NetworkSection({ system }: NetworkSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Network className="h-4 w-4" /> Information réseau
      </h3>
      
      {system.networkInfo ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="text-sm">
            <span className="text-muted-foreground">Adresse IP:</span>
          </div>
          <div className="text-sm">{system.networkInfo.ipAddress || "Non configurée"}</div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Masque:</span>
          </div>
          <div className="text-sm">{system.networkInfo.subnetMask || "Non configurée"}</div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Passerelle:</span>
          </div>
          <div className="text-sm">{system.networkInfo.gateway || "Non configurée"}</div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Port:</span>
          </div>
          <div className="text-sm">{system.networkInfo.switchPort || "Non configuré"}</div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucune information réseau configurée</p>
      )}
    </div>
  );
}
