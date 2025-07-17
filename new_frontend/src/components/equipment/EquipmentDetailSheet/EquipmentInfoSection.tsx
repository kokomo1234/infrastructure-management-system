
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EquipmentInfoSectionProps {
  title: string;
  data: Record<string, any>;
  icon: React.ReactNode;
  getStatusColor?: (status: string) => string;
  formatValue: (value: any) => string;
}

export function EquipmentInfoSection({ 
  title, 
  data, 
  icon, 
  getStatusColor, 
  formatValue 
}: EquipmentInfoSectionProps) {
  const filteredData = Object.entries(data).filter(([key, value]) => 
    value !== undefined && value !== null && value !== ""
  );

  if (filteredData.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map(([key, value]) => (
            <div key={key}>
              <p className="text-sm font-medium text-muted-foreground">{key}</p>
              {key === "Statut" && getStatusColor ? (
                <Badge variant="outline" className={getStatusColor(value)}>
                  {formatValue(value)}
                </Badge>
              ) : (
                <p className="text-sm mt-1">{formatValue(value)}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
