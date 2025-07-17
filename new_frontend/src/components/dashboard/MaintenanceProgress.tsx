
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BadgeCheck, Hammer, AlertTriangle, TrendingUp, Clock, Target } from "lucide-react";

// Mock data - would come from backend in real app
const progressData = {
  "Système DC": 75,
  "UPS": 90,
  "Generatrice": 60,
  "TSW": 80,
  "Mécanique": 45,
  "Incendie": 100
};

export function MaintenanceProgress() {
  const [filter, setFilter] = useState<string>("all");
  
  // Filter the progress data based on selection
  const filteredData = filter === "all" 
    ? progressData 
    : Object.fromEntries(Object.entries(progressData).filter(([key]) => key === filter));

  const isShowingAll = filter === "all";
  const gridClass = isShowingAll 
    ? "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
    : "grid gap-4";

  const getStatusIcon = (value: number) => {
    if (value < 50) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    if (value === 100) return <BadgeCheck className="h-5 w-5 text-emerald-500" />;
    if (value >= 80) return <TrendingUp className="h-5 w-5 text-blue-500" />;
    return <Clock className="h-5 w-5 text-indigo-500" />;
  };

  const getCardGradient = (value: number) => {
    if (value === 100) return "bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-emerald-200";
    if (value >= 80) return "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border-blue-200";
    if (value >= 50) return "bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-amber-200";
    return "bg-gradient-to-br from-red-50 via-pink-50 to-red-100 border-red-200";
  };

  const getProgressGradient = (value: number) => {
    if (value === 100) return "bg-gradient-to-r from-emerald-400 to-green-500";
    if (value >= 80) return "bg-gradient-to-r from-blue-400 to-indigo-500";
    if (value >= 50) return "bg-gradient-to-r from-amber-400 to-yellow-500";
    return "bg-gradient-to-r from-red-400 to-pink-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Progrès de maintenance</h3>
            <p className="text-sm text-muted-foreground">Suivi en temps réel</p>
          </div>
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44 h-9 border-2 border-blue-100 bg-white/80 backdrop-blur-sm hover:border-blue-200 transition-colors">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.keys(progressData).map(key => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={gridClass}>
        {Object.entries(filteredData).map(([type, value], index) => (
          <div 
            key={type} 
            className={cn(
              "group relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in",
              getCardGradient(value),
              !isShowingAll && "col-span-full"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-[length:20px_20px]" />
            </div>
            
            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/60 backdrop-blur-sm">
                    {getStatusIcon(value)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{type}</h4>
                    <p className="text-xs text-gray-600">Maintenance {value >= 80 ? 'avancée' : value >= 50 ? 'en cours' : 'requise'}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm shadow-sm",
                    value === 100 ? "bg-emerald-500 text-white" :
                    value >= 80 ? "bg-blue-500 text-white" :
                    value >= 50 ? "bg-amber-500 text-white" :
                    "bg-red-500 text-white"
                  )}>
                    <span>{value}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {value === 100 ? 'Terminé' : `${100 - value}% restant`}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Progression</span>
                  <span>{value}/100</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={value} 
                    className="h-3 bg-white/60 backdrop-blur-sm border border-white/20"
                  />
                  <div 
                    className={cn(
                      "absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm",
                      getProgressGradient(value)
                    )}
                    style={{ 
                      width: `${value}%`,
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {Object.keys(filteredData).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Aucun équipement sélectionné</p>
        </div>
      )}
    </div>
  );
}
