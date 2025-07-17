
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface WeatherLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface CityManagerProps {
  weatherLocations: WeatherLocation[];
  setWeatherLocations: React.Dispatch<React.SetStateAction<WeatherLocation[]>>;
}

const geocodeCity = async (cityName: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)},Quebec,Canada&limit=1`,
      {
        headers: {
          'Accept-Language': 'fr',
          'User-Agent': 'InfrastructureManagementTool/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error("Erreur lors de la recherche de la ville");
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export function CityManager({ weatherLocations, setWeatherLocations }: CityManagerProps) {
  const [addCityDialogOpen, setAddCityDialogOpen] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCity = async () => {
    if (!newCityName) {
      toast("Veuillez entrer un nom de ville", {
        description: "Le nom de la ville est requis"
      });
      return;
    }

    if (weatherLocations.some(loc => loc.name.toLowerCase() === newCityName.trim().toLowerCase())) {
      toast("Cette ville existe déjà", {
        description: "Veuillez choisir un nom différent.",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const coordinates = await geocodeCity(newCityName);
      
      if (!coordinates) {
        toast("Ville non trouvée", {
          description: "Impossible de trouver les coordonnées pour cette ville. Vérifiez l'orthographe ou essayez une autre ville du Québec.",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }
      
      const cityName = newCityName.trim();
      const id = cityName.toLowerCase().replace(/\s+/g, '-');
      
      const newLocation: WeatherLocation = {
        id,
        name: cityName,
        lat: coordinates.lat,
        lon: coordinates.lon
      };

      setWeatherLocations(prev => [...prev, newLocation]);
      setNewCityName("");
      setAddCityDialogOpen(false);

      toast("Ville ajoutée avec succès", {
        description: `${cityName} a été ajoutée à la liste des emplacements.`,
        duration: 3000,
      });
    } catch (error) {
      toast("Erreur lors de l'ajout de la ville", {
        description: "Une erreur s'est produite lors de la recherche des coordonnées de la ville.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setAddCityDialogOpen(true)}
        title="Ajouter une ville"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>

      <Dialog open={addCityDialogOpen} onOpenChange={setAddCityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une ville</DialogTitle>
            <DialogDescription>
              Entrez le nom d'une ville du Québec pour l'ajouter à la liste des emplacements météo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="city-name" className="text-right">
                Nom de la ville:
              </label>
              <Input 
                id="city-name" 
                value={newCityName} 
                onChange={(e) => setNewCityName(e.target.value)} 
                className="col-span-3" 
                placeholder="Trois-Rivières"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleAddCity} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recherche...
                </>
              ) : (
                'Ajouter'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
