
import { DCSystem } from "@/types/dcSystem";
import { CircuitBoard } from "lucide-react";

interface CBDBSectionProps {
  system: DCSystem;
}

export function CBDBSection({ system }: CBDBSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <CircuitBoard className="h-4 w-4" /> CBDB
      </h3>
      
      {system.cdbds.length > 0 ? (
        <ul className="space-y-1">
          {system.cdbds.map(cbdb => (
            <li key={cbdb.id} className="flex justify-between text-sm">
              <span>{cbdb.name}</span>
              <span>{cbdb.capacityAmp}A, {cbdb.fuseCount} fusibles</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Aucun CBDB installé</p>
      )}
    </div>
  );
}
