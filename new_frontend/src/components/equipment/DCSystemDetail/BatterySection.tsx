
import { DCSystem } from "@/types/dcSystem";
import { Battery } from "lucide-react";
import { calculateTotalBatteryCapacity } from "@/lib/dcSystemService";

interface BatterySectionProps {
  system: DCSystem;
}

export function BatterySection({ system }: BatterySectionProps) {
  const totalBatteryAh = calculateTotalBatteryCapacity(system);
  
  const calculateBatteryAge = (dateString?: string): string => {
    if (!dateString) return "N/A";
    
    const manufacture = new Date(dateString);
    const today = new Date();
    
    const ageInYears = today.getFullYear() - manufacture.getFullYear();
    const monthDiff = today.getMonth() - manufacture.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < manufacture.getDate())) {
      return `${ageInYears - 1} ans, ${12 + monthDiff} mois`;
    }
    
    return `${ageInYears} ans, ${monthDiff} mois`;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Battery className="h-4 w-4" /> Batteries
      </h3>
      
      {system.batteryPacks.length > 0 ? (
        <ul className="space-y-1">
          {system.batteryPacks.map(battery => (
            <li key={battery.id} className="flex flex-col space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{battery.name}</span>
                <span>{battery.capacityAh}Ah ({battery.type})</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pl-2">
                <span>NB accumulateur: {battery.cellCount || 'N/A'}</span>
                <span>Âge: {calculateBatteryAge(battery.manufactureDate)}</span>
                {battery.lastInspectionDate && (
                  <span>Dernière inspection: {new Date(battery.lastInspectionDate).toLocaleDateString('fr-CA')}</span>
                )}
                {battery.nextInspectionDate && (
                  <span>Prochaine inspection: {new Date(battery.nextInspectionDate).toLocaleDateString('fr-CA')}</span>
                )}
                {battery.rating && <span>Côte: {battery.rating}/10</span>}
              </div>
            </li>
          ))}
          <li className="flex justify-between text-sm font-medium mt-1">
            <span>Capacité totale</span>
            <span>{totalBatteryAh}Ah</span>
          </li>
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Aucune batterie installée</p>
      )}
    </div>
  );
}
