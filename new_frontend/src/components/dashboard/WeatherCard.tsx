
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { WeatherLocationSelector } from "@/components/dashboard/WeatherLocationSelector";
import { CityManager } from "@/components/dashboard/CityManager";
import { Cloud } from "lucide-react";

interface WeatherLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface WeatherCardProps {
  weatherLocations: WeatherLocation[];
  setWeatherLocations: React.Dispatch<React.SetStateAction<WeatherLocation[]>>;
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
}

export function WeatherCard({ weatherLocations, setWeatherLocations, selectedLocation, onLocationChange }: WeatherCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-infra-blue" />
              Météo
            </CardTitle>
            <CardDescription>Conditions météorologiques actuelles</CardDescription>
          </div>
          <CityManager 
            weatherLocations={weatherLocations} 
            setWeatherLocations={setWeatherLocations} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <WeatherLocationSelector 
          selectedLocation={selectedLocation}
          weatherLocations={weatherLocations}
          onLocationChange={onLocationChange}
        />
        
        <div className="mt-4">
          <WeatherWidget 
            location={weatherLocations.find(loc => loc.id === selectedLocation) || weatherLocations[0]}
            locations={weatherLocations}
            onLocationChange={onLocationChange}
            autoRotate={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}
