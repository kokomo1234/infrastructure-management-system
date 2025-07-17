
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CloudLightning } from "lucide-react";
import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StandbySchedule } from "@/components/dashboard/StandbySchedule";
import { DashboardActivities } from "@/components/dashboard/DashboardActivities";
import { MaintenanceProgress } from "@/components/dashboard/MaintenanceProgress";
import { useState } from "react";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { UnifiedCalendar } from "@/components/common/UnifiedCalendar";
import { CalendarNoteDialog } from "@/components/dashboard/CalendarNoteDialog";

interface WeatherLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface DashboardOverviewProps {
  weatherLocations: WeatherLocation[];
  setWeatherLocations: React.Dispatch<React.SetStateAction<WeatherLocation[]>>;
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
}

export function DashboardOverview({ 
  weatherLocations, 
  setWeatherLocations, 
  selectedLocation, 
  onLocationChange 
}: DashboardOverviewProps) {
  const [calendarKey, setCalendarKey] = useState(0);

  const handleNoteAdded = () => {
    setCalendarKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <WeatherCard 
          weatherLocations={weatherLocations}
          setWeatherLocations={setWeatherLocations}
          selectedLocation={selectedLocation}
          onLocationChange={onLocationChange}
        />

        <DashboardActivities />
      </div>

      <Alert className="bg-amber-50 border-amber-200">
        <CloudLightning className="h-5 w-5 text-amber-500" />
        <AlertTitle className="text-amber-700">Alerte météo extrême</AlertTitle>
        <AlertDescription className="text-amber-700">
          Tempête hivernale prévue pour la région de Québec entre le 15-16 décembre. 
          Rafales jusqu'à 70 km/h et accumulations de 25-30 cm de neige prévues.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-t-4 border-indigo-500" key={calendarKey}>
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Calendrier Intégré
            </CardTitle>
            <CardDescription>
              Gardes, projets, événements et notes personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnifiedCalendar 
              title="Vue d'ensemble"
              onEventClick={(event) => console.log('Event clicked:', event)}
            />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-infra-blue bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-2">
            <CardTitle>Garde</CardTitle>
            <CardDescription>Personnel de garde</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            <StandbySchedule compact={false} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-t-4 border-infra-blue">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-infra-blue to-purple-500 bg-clip-text text-transparent">
            Progrès de la maintenance
          </CardTitle>
          <CardDescription>
            Progression mensuelle par type d'équipement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MaintenanceProgress />
        </CardContent>
      </Card>

      <QuickLinks />
    </div>
  );
}
