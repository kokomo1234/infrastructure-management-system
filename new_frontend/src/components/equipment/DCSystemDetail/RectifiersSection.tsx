
import { DCSystem } from "@/types/dcSystem";
import { Zap } from "lucide-react";

interface RectifiersSectionProps {
  system: DCSystem;
}

export function RectifiersSection({ system }: RectifiersSectionProps) {
  // Group rectifiers by model
  const rectifierModels = system.rectifiers.reduce((acc, rectifier) => {
    const existingGroup = acc.find(group => group.name === rectifier.name);
    if (existingGroup) {
      existingGroup.count += 1;
      existingGroup.totalCapacity += rectifier.capacity;
    } else {
      acc.push({
        name: rectifier.name,
        count: 1,
        capacity: rectifier.capacity,
        totalCapacity: rectifier.capacity
      });
    }
    return acc;
  }, [] as { name: string; count: number; capacity: number; totalCapacity: number }[]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Zap className="h-4 w-4" /> Redresseurs
      </h3>
      
      {rectifierModels.length > 0 ? (
        <ul className="space-y-1">
          {rectifierModels.map((model, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span>{model.name}</span>
              <span>{model.count} × {model.capacity}W = {model.totalCapacity}W</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Aucun redresseur installé</p>
      )}
    </div>
  );
}
