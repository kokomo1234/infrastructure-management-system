
import { ColumnDefinition } from "@/components/equipment/CustomizableTable";

export const contractorColumns: ColumnDefinition[] = [
  { id: "company", label: "Compagnie", accessor: "company" },
  { id: "address", label: "Adresse", accessor: "address" },
  { id: "city", label: "Ville", accessor: "city" },
  { id: "province", label: "Province", accessor: "province" },
  { id: "postalCode", label: "Code postal", accessor: "postalCode" },
  { id: "region", label: "Région", accessor: "region" },
  { id: "email", label: "Courriel", accessor: "email" },
  { id: "serviceNumber", label: "Num. appel service", accessor: "serviceNumber" },
  { id: "serviceTypes", label: "Type de service", accessor: "serviceTypes" },
  { id: "emergencyContact", label: "Personne urgence", accessor: "emergencyContact" },
  { id: "emergencyPhone", label: "Numéro tél. urgence", accessor: "emergencyPhone" },
  { id: "sapNumber", label: "Numéro SAP", accessor: "sapNumber" },
  { id: "status", label: "Statut", accessor: "status" },
];

// Données de test pour les entrepreneurs
export const mockContractors = [
  {
    id: "1",
    company: "MécaFroid Inc.",
    address: "123 Boulevard Industriel",
    city: "Montréal",
    province: "QC",
    postalCode: "H3K 1G6",
    region: "Montréal",
    email: "service@mecafroid.com",
    serviceNumber: "514-555-1234",
    serviceTypes: ["Mécanique", "UPS"],
    emergencyContact: "Jean Tremblay",
    emergencyPhone: "514-555-9876",
    sapNumber: "S1002345",
    status: "Actif"
  },
  {
    id: "2",
    company: "Électro-Systèmes Québec",
    address: "456 Rue du Commerce",
    city: "Québec",
    province: "QC",
    postalCode: "G1N 4P3",
    region: "Capitale-Nationale",
    email: "info@electrosystemes.qc.ca",
    serviceNumber: "418-555-4321",
    serviceTypes: ["Système DC", "TSW"],
    emergencyContact: "Marie Pelletier",
    emergencyPhone: "418-555-8765",
    sapNumber: "S2003456",
    status: "Actif"
  },
  {
    id: "3",
    company: "Sécurité Incendie Plus",
    address: "789 Avenue des Services",
    city: "Sherbrooke",
    province: "QC",
    postalCode: "J1H 2R4",
    region: "Estrie",
    email: "urgence@siplus.ca",
    serviceNumber: "819-555-6789",
    serviceTypes: ["Incendie"],
    emergencyContact: "Pierre Lavoie",
    emergencyPhone: "819-555-7654",
    sapNumber: "S3004567",
    status: "Actif"
  }
];
