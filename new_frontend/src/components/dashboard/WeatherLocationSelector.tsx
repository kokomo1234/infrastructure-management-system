
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WeatherLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface WeatherLocationSelectorProps {
  selectedLocation: string;
  weatherLocations: WeatherLocation[];
  onLocationChange: (locationId: string) => void;
}

export function WeatherLocationSelector({ selectedLocation, weatherLocations, onLocationChange }: WeatherLocationSelectorProps) {
  return (
    <Select value={selectedLocation} onValueChange={onLocationChange}>
      <SelectTrigger>
        <SelectValue placeholder="Choisir un emplacement" />
      </SelectTrigger>
      <SelectContent>
        {weatherLocations.map((location) => (
          <SelectItem key={location.id} value={location.id}>
            {location.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
