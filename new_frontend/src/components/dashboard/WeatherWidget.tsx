
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown, Cloud, CloudLightning, CloudRain, CloudSnow, Sun, Wind } from "lucide-react";

interface WeatherLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherWidgetProps {
  location: WeatherLocation;
  locations: WeatherLocation[];
  onLocationChange: (locationId: string) => void;
  autoRotate?: boolean;
}

// Mock weather data - would be replaced with actual API call
const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate some random weather data
  const descriptions = ["Ensoleillé", "Nuageux", "Pluie légère", "Neige", "Orageux"];
  const icons = ["sun", "cloud", "cloud-rain", "cloud-snow", "cloud-lightning"];
  
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  
  return {
    temp: Math.floor(Math.random() * 30) - 10, // -10 to 20 degrees
    description: descriptions[randomIndex],
    icon: icons[randomIndex],
    humidity: Math.floor(Math.random() * 100),
    windSpeed: Math.floor(Math.random() * 50),
  };
};

export function WeatherWidget({ location, locations, onLocationChange, autoRotate = true }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForecast, setShowForecast] = useState(false);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef<boolean>(false);

  // Set up auto rotation timer
  useEffect(() => {
    if (autoRotate && locations.length > 1) {
      // Clear any existing timer
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
      }
      
      // Set up new timer
      autoRotateTimerRef.current = setInterval(() => {
        if (!userInteractedRef.current) {
          // Find current location index
          const currentIndex = locations.findIndex(loc => loc.id === location.id);
          const nextIndex = (currentIndex + 1) % locations.length;
          onLocationChange(locations[nextIndex].id);
        }
        // Reset user interaction after rotating
        userInteractedRef.current = false;
      }, 15000); // 15 seconds
    }

    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
      }
    };
  }, [location.id, locations, onLocationChange, autoRotate]);

  // Fetch weather data when location changes
  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      try {
        const data = await fetchWeatherData(location.lat, location.lon);
        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getWeather();
  }, [location]);

  // Handle location selection by user
  const handleLocationSelect = (locationId: string) => {
    userInteractedRef.current = true;
    onLocationChange(locationId);
  };

  const getWeatherIcon = (iconName: string) => {
    switch(iconName) {
      case "sun": return <Sun className="h-10 w-10 text-yellow-500" />;
      case "cloud": return <Cloud className="h-10 w-10 text-gray-500" />;
      case "cloud-rain": return <CloudRain className="h-10 w-10 text-blue-500" />;
      case "cloud-snow": return <CloudSnow className="h-10 w-10 text-blue-300" />;
      case "cloud-lightning": return <CloudLightning className="h-10 w-10 text-amber-500" />;
      default: return <Cloud className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="rounded-lg overflow-hidden">
        {loading ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-14 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ) : weather ? (
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">{location.name}</h3>
            </div>
            
            <div className="mt-2 flex items-center gap-4">
              {getWeatherIcon(weather.icon)}
              <div>
                <div className="text-3xl font-bold">{weather.temp}°C</div>
                <div className="text-sm text-muted-foreground">{weather.description}</div>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span>Vent: {weather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center gap-1">
                <CloudRain className="h-4 w-4 text-muted-foreground" />
                <span>Humidité: {weather.humidity}%</span>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 w-full flex items-center justify-center gap-1"
              onClick={() => {
                setShowForecast(!showForecast);
                userInteractedRef.current = true;
              }}
            >
              Prévisions <ChevronDown className={`h-4 w-4 transition-transform ${showForecast ? 'rotate-180' : ''}`} />
            </Button>
            
            {showForecast && (
              <div className="mt-2 border-t pt-2 text-sm">
                <div className="grid grid-cols-5 gap-1 text-center">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span>{day}</span>
                      {getWeatherIcon(["sun", "cloud", "cloud-rain", "cloud", "sun"][i])}
                      <span>{Math.floor(Math.random() * 30) - 5}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            Impossible de charger les données météo
          </div>
        )}
      </div>
    </div>
  );
}
