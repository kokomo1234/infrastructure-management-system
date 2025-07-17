
import { useState } from "react";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

interface WeatherLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

const initialWeatherLocations: WeatherLocation[] = [
  { id: "montreal", name: "Montréal", lat: 45.5017, lon: -73.5673 },
  { id: "quebec", name: "Québec", lat: 46.8139, lon: -71.2080 },
  { id: "sherbrooke", name: "Sherbrooke", lat: 45.4042, lon: -71.8929 },
  { id: "gatineau", name: "Gatineau", lat: 45.4765, lon: -75.7013 },
  { id: "laval", name: "Laval", lat: 45.6066, lon: -73.7120 },
];

const Dashboard = () => {
  const [weatherLocations, setWeatherLocations] = useState<WeatherLocation[]>(initialWeatherLocations);
  const [selectedLocation, setSelectedLocation] = useState<string>(weatherLocations[0].id);

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of infrastructure and maintenance operations.
        </p>
      </div>

      <DashboardTabs 
        weatherLocations={weatherLocations}
        setWeatherLocations={setWeatherLocations}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
}

export default Dashboard;
