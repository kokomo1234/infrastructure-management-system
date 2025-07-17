
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StandbyPersonDisplay } from "./StandbyPersonDisplay";
import { StandbyPerson } from "@/types/standby";
import { Clock } from "lucide-react";

interface StandbyWeekCardProps {
  title: string;
  person: StandbyPerson | undefined;
  borderColor: string;
  bgColor: string;
  showRequestButton?: boolean;
  showManageButton?: boolean;
  onRequestClick?: () => void;
  onManageClick?: () => void;
}

export function StandbyWeekCard({
  title,
  person,
  borderColor,
  bgColor,
  showRequestButton = false,
  showManageButton = false,
  onRequestClick,
  onManageClick
}: StandbyWeekCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor} ${bgColor}`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="space-y-1 mb-2 sm:mb-0">
            <h4 className="font-semibold text-sm">{title}</h4>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Du vendredi 16h au vendredi 7h</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            {person ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <StandbyPersonDisplay 
                  person={person} 
                  borderColor={borderColor} 
                  bgColor={bgColor}
                />
                
                {showRequestButton && onRequestClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRequestClick}
                  >
                    Demander remplacement
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">Aucune personne assignée</div>
            )}
            
            {showManageButton && onManageClick && (
              <Button
                variant="default"
                size="sm"
                onClick={onManageClick}
              >
                Gérer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
