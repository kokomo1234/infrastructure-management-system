
import { ColumnDefinition } from "@/components/equipment/CustomizableTable";

export const logsColumns: ColumnDefinition[] = [
  { id: "date", label: "Date", accessor: "date" },
  { id: "time", label: "Heure", accessor: "time" },
  { id: "user", label: "Utilisateur", accessor: "user" },
  { id: "action", label: "Action", accessor: "action" },
  { id: "itemType", label: "Type d'élément", accessor: "itemType" },
  { id: "itemName", label: "Nom de l'élément", accessor: "itemName" },
  { id: "details", label: "Détails", accessor: "details" },
  { id: "difference", label: "Différences", accessor: "difference", isVisible: false },
];

// Données de test pour les journaux
export const mockLogs = [
  {
    id: "1",
    date: "2025-04-10",
    time: "09:23",
    user: "Jean Dupont",
    action: "Modification",
    itemType: "Équipement",
    itemName: "UPS-MTL-001",
    details: "Mise à jour des informations de maintenance",
    difference: "Date de maintenance: 2025-03-15 -> 2025-04-15"
  },
  {
    id: "2",
    date: "2025-04-09",
    time: "14:05",
    user: "Marie Tremblay",
    action: "Ajout",
    itemType: "Site",
    itemName: "Station Laval",
    details: "Création d'un nouveau site",
    difference: "Nouveau site ajouté avec 3 TDL"
  },
  {
    id: "3",
    date: "2025-04-08",
    time: "11:30",
    user: "Philippe Martin",
    action: "Retrait",
    itemType: "Équipement",
    itemName: "GEN-QUE-002",
    details: "Retrait d'une génératrice obsolète",
    difference: "Équipement retiré: Génératrice Caterpillar D3516"
  },
  {
    id: "4",
    date: "2025-04-07",
    time: "16:45",
    user: "Sophie Lavoie",
    action: "Modification",
    itemType: "Entrepreneur",
    itemName: "MécaFroid Inc.",
    details: "Mise à jour des coordonnées",
    difference: "Téléphone: 514-555-1111 -> 514-555-1234"
  },
];

export const getActionColor = (action: string) => {
  switch (action) {
    case "Ajout": return "bg-green-100 text-green-800";
    case "Modification": return "bg-blue-100 text-blue-800";
    case "Retrait": return "bg-red-100 text-red-800";
    case "Remplacement": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
