import { useState, useEffect } from "react";
import { SiteType } from "@/types/site";

// Initial site data
const sitesData = [
  {
    id: "1",
    name: "Centrale Montréal",
    address: "123 Rue Sainte-Catherine",
    city: "Montréal",
    postalCode: "H2X 1Z4",
    province: "QC",
    class: "1",
    phase: "Triphasé",
    voltage: "347/600",
    powerFactor: 0.95,
    equipmentCount: 15,
    status: "Actif",
    tdls: [
      {
        id: "1-1",
        name: "Salle principale",
        equipmentCount: 10,
        phase: "Triphasé",
        voltage: "347/600",
        powerFactor: 0.95
      },
      {
        id: "1-2",
        name: "Salle auxiliaire",
        equipmentCount: 5,
        phase: "Triphasé",
        voltage: "120/208",
        powerFactor: 0.92
      }
    ],
    totalCapacityKW: 750,
    usedCapacityKW: 450,
    remainingCapacityKW: 300,
    inputVoltage: "347/600V",
    inputCurrent: "800A",
    emergencyPercentage: 80,
    generators: [
      {
        id: "gen-1",
        name: "Génératrice principale",
        capacity: 500,
        tswName: "TSW-A",
        isRedundant: false
      },
      {
        id: "gen-2",
        name: "Génératrice secondaire",
        capacity: 250,
        tswName: "TSW-B",
        isRedundant: true
      }
    ],
    tsws: [
      {
        id: "tsw-1",
        name: "TSW-A",
        capacity: 550,
        currentLoad: 400,
        isRedundant: false
      },
      {
        id: "tsw-2",
        name: "TSW-B",
        capacity: 250,
        currentLoad: 180,
        isRedundant: true
      },
      {
        id: "tsw-3",
        name: "TSW-C",
        capacity: 150,
        currentLoad: 120,
        isRedundant: false
      }
    ],
    airConditioners: [
      {
        id: "ac-1",
        name: "AC-Nord-1",
        sensibleKW: 45,
        pair: "AC-Nord-2",
        isRedundant: false
      },
      {
        id: "ac-2",
        name: "AC-Nord-2",
        sensibleKW: 45,
        pair: "AC-Nord-1",
        isRedundant: false
      },
      {
        id: "ac-3",
        name: "AC-Sud-1",
        sensibleKW: 30,
        pair: "AC-Sud-2",
        isRedundant: true
      },
      {
        id: "ac-4",
        name: "AC-Sud-2",
        sensibleKW: 30,
        pair: "AC-Sud-1",
        isRedundant: false
      }
    ],
    ups: [
      {
        id: "ups-1",
        name: "UPS-A",
        capacity: 100,
        currentLoad: 75,
        pair: "UPS-B",
        isRedundant: false
      },
      {
        id: "ups-2",
        name: "UPS-B",
        capacity: 100,
        currentLoad: 70,
        pair: "UPS-A",
        isRedundant: true
      }
    ],
    dcSystems: [
      {
        id: "dc-1",
        name: "DC-System-1",
        capacity: 80,
        installedCapacity: 60,
        actualLoad: 45
      },
      {
        id: "dc-2",
        name: "DC-System-2",
        capacity: 60,
        installedCapacity: 50,
        actualLoad: 35
      }
    ]
  },
  {
    id: "2",
    name: "Station Québec",
    address: "456 Boulevard Charest",
    city: "Québec",
    postalCode: "G1K 3H9",
    province: "QC",
    class: "2",
    phase: "Monophasé",
    voltage: "120/240",
    powerFactor: 0.93,
    equipmentCount: 8,
    status: "Actif",
    tdls: [
      {
        id: "2-1",
        name: "Station Québec",
        equipmentCount: 8,
        phase: "Monophasé",
        voltage: "120/240",
        powerFactor: 0.93
      }
    ],
    totalCapacityKW: 350,
    usedCapacityKW: 280,
    remainingCapacityKW: 70,
    inputVoltage: "120/240V",
    inputCurrent: "400A",
    emergencyPercentage: 80,
    generators: [
      {
        id: "gen-3",
        name: "Génératrice QC-1",
        capacity: 300,
        tswName: "TSW-QC1",
        isRedundant: false
      }
    ],
    tsws: [
      {
        id: "tsw-4",
        name: "TSW-QC1",
        capacity: 320,
        currentLoad: 250,
        isRedundant: false
      }
    ],
    airConditioners: [
      {
        id: "ac-5",
        name: "AC-Principal",
        sensibleKW: 25,
        pair: "",
        isRedundant: false
      }
    ],
    ups: [
      {
        id: "ups-3",
        name: "UPS-Q",
        capacity: 50,
        currentLoad: 30,
        pair: "",
        isRedundant: false
      }
    ],
    dcSystems: []
  },
  {
    id: "3",
    name: "Centre Sherbrooke",
    address: "789 Rue King Ouest",
    city: "Sherbrooke",
    postalCode: "J1H 1R8",
    province: "QC",
    class: "Production",
    phase: "3",
    voltage: "600V",
    powerFactor: 0.97,
    equipmentCount: 12,
    status: "Maintenance",
    tdls: [
      {
        id: "3-1",
        name: "Salle nord",
        equipmentCount: 7,
        phase: "3",
        voltage: "600V",
        powerFactor: 0.97
      },
      {
        id: "3-2",
        name: "Salle sud",
        equipmentCount: 5,
        phase: "3",
        voltage: "600V",
        powerFactor: 0.96
      }
    ]
  },
  {
    id: "4",
    name: "Poste Gatineau",
    address: "101 Rue Principale",
    city: "Gatineau",
    postalCode: "J9H 6M8",
    province: "QC",
    class: "Distribution",
    phase: "1",
    voltage: "120V",
    powerFactor: 0.91,
    equipmentCount: 6,
    status: "Actif",
    tdls: [
      {
        id: "4-1",
        name: "Poste Gatineau",
        equipmentCount: 6,
        phase: "1",
        voltage: "120V",
        powerFactor: 0.91
      }
    ]
  },
  {
    id: "5",
    name: "Installation Laval",
    address: "202 Boulevard Saint-Martin",
    city: "Laval",
    postalCode: "H7N 1T2",
    province: "QC",
    class: "Stockage",
    phase: "1",
    voltage: "240V",
    powerFactor: 0.89,
    equipmentCount: 4,
    status: "Inactif",
    tdls: [
      {
        id: "5-1",
        name: "Zone A",
        equipmentCount: 2,
        phase: "1",
        voltage: "240V",
        powerFactor: 0.89
      },
      {
        id: "5-2",
        name: "Zone B",
        equipmentCount: 2,
        phase: "1",
        voltage: "240V",
        powerFactor: 0.88
      }
    ]
  }
];

// Hook for sites management
export const useSites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSites, setFilteredSites] = useState<SiteType[]>(sitesData);
  const [expandedSites, setExpandedSites] = useState<string[]>([]);
  const [localSitesData, setLocalSitesData] = useState<SiteType[]>(sitesData);
  const [currentView, setCurrentView] = useState<"list" | "grid">("list");
  const [selectedSite, setSelectedSite] = useState<SiteType | null>(null);

  // Filter sites based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSites(localSitesData);
    } else {
      const filtered = localSitesData.filter(site => 
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSites(filtered);
    }
  }, [searchTerm, localSitesData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif": return "bg-green-100 text-green-800";
      case "Inactif": return "bg-gray-100 text-gray-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const toggleSiteExpansion = (siteId: string) => {
    setExpandedSites(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId) 
        : [...prev, siteId]
    );
  };

  const isSiteExpanded = (siteId: string): boolean => {
    return expandedSites.includes(siteId);
  };

  const handleAddTdl = (newTdl: any) => {
    if (!newTdl.complexId) {
      return false;
    }
    
    // Create a new TDL object
    const tdl = {
      id: `${newTdl.complexId}-${Date.now()}`, // Generate a unique ID
      name: newTdl.name,
      equipmentCount: 0,
      phase: newTdl.phase,
      voltage: newTdl.voltage,
      powerFactor: parseFloat(newTdl.powerFactor)
    };
    
    // Update the sites data with the new TDL
    setLocalSitesData(prevSites => {
      return prevSites.map(site => {
        if (site.id === newTdl.complexId) {
          return {
            ...site,
            tdls: [...site.tdls, tdl]
          };
        }
        return site;
      });
    });
    
    return true;
  };
  
  const handleNewSite = (data: any) => {
    // Create a new site object
    const newSite = {
      id: `site-${Date.now()}`, // Generate a unique ID
      name: data.name,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      province: "QC", // Default to QC
      class: data.class,
      phase: data.phase,
      voltage: data.voltage, // Use selected voltage
      powerFactor: 0.95,
      equipmentCount: 0,
      status: "Actif",
      tdls: [],
      totalCapacityKW: 0,
      usedCapacityKW: 0,
      remainingCapacityKW: 0,
      generators: [],
      tsws: [],
      airConditioners: [],
      ups: [],
      dcSystems: []
    };
    
    // Add the new site to the sites data
    setLocalSitesData(prevSites => [...prevSites, newSite]);
    return true;
  };
  
  const handleEditSite = (data: any) => {
    // Update the existing site
    setLocalSitesData(prevSites => {
      return prevSites.map(site => {
        if (site.id === data.id) {
          return {
            ...site,
            name: data.name,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            province: data.province,
            class: data.class,
            phase: data.phase,
            voltage: data.voltage,
            powerFactor: parseFloat(data.powerFactor),
            status: data.status
          };
        }
        return site;
      });
    });
    return true;
  };

  const handleViewChange = (view: "list" | "grid") => {
    setCurrentView(view);
  };

  const handleViewTDLDetails = (site: SiteType) => {
    setSelectedSite(site);
  };
  
  const handleBackToSites = () => {
    setSelectedSite(null);
  };

  return {
    searchTerm,
    filteredSites,
    expandedSites,
    currentView,
    selectedSite,
    handleSearch,
    getStatusColor,
    toggleSiteExpansion,
    isSiteExpanded,
    handleAddTdl,
    handleNewSite,
    handleEditSite,
    handleViewChange,
    handleViewTDLDetails,
    handleBackToSites
  };
};
