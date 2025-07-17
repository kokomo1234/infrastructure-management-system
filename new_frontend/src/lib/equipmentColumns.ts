
import { ColumnDefinition } from "@/components/equipment/CustomizableTable";

// Common columns that are shared across all equipment types
const commonColumns: ColumnDefinition[] = [
  { id: "name", label: "Nom d'équipement", accessor: "name" },
  { id: "complexe", label: "Complexe", accessor: "location" },
  { id: "tdl", label: "TDL", accessor: "tdl" },
  { id: "address", label: "Adresse", accessor: "address" },
  { id: "city", label: "Ville", accessor: "city" },
  { id: "postalCode", label: "Code Postal", accessor: "postalCode" },
  { id: "region", label: "Région", accessor: "region" },
  { id: "equipmentType", label: "Type d'équipement", accessor: "type" },
  { id: "brand", label: "Marque", accessor: "brand" },
  { id: "model", label: "Modèle", accessor: "model" },
  { id: "serialNumber", label: "Numéro de série", accessor: "serialNumber" },
  { id: "installDate", label: "Date d'installation", accessor: "installDate" },
  { id: "status", label: "Statut", accessor: "status" },
];

// UPS specific columns
export const upsColumns: ColumnDefinition[] = [
  ...commonColumns,
  { id: "power", label: "Puissance (KW)", accessor: "power" },
  { id: "voltage", label: "Tension", accessor: "voltage" },
  { id: "supplierName", label: "Nom du fournisseur", accessor: "supplierName" },
  { id: "supplierNumber", label: "NO de fournisseur", accessor: "supplierNumber" },
  { id: "contacts", label: "Contacts", accessor: "contacts" },
  { id: "email", label: "Courriel", accessor: "email" },
  { id: "siteLoad", label: "Charge du site (KW)", accessor: "siteLoad" },
  { id: "batteryModel", label: "Modèle de batterie", accessor: "batteryModel" },
  { id: "batteryBankCount", label: "Nb de banc de batterie", accessor: "batteryBankCount" },
  { id: "cellsPerBank", label: "Nb de cellule par banc", accessor: "cellsPerBank" },
  { id: "totalCells", label: "Nb de cellule total", accessor: "totalCells" },
  { id: "batteryManufactureDate", label: "Date fabrication des batteries", accessor: "batteryManufactureDate" },
  { id: "batteryAge", label: "Âge batteries", accessor: "batteryAge" },
  { id: "batteryComments", label: "Commentaires batteries", accessor: "batteryComments" },
  { id: "chargePercentage", label: "% de charge", accessor: "chargePercentage" },
  { id: "autonomy", label: "Autonomie (En Mins)", accessor: "autonomy" },
  { id: "password", label: "Mot de passe", accessor: "password" },
  { id: "ipAddress", label: "Adresse IP", accessor: "ipAddress" },
  { id: "switchPort", label: "Port de switch", accessor: "switchPort" },
  { id: "gateway", label: "Gateway", accessor: "gateway" },
  { id: "netmask", label: "Netmask", accessor: "netmask" },
  { id: "macId", label: "MAC ID", accessor: "macId" },
  { id: "age", label: "Âge UPS", accessor: "age" },
  { id: "warrantyEndDate", label: "Date de fin de garantie", accessor: "warrantyEndDate" },
  { id: "contractEndDate", label: "Échéance du contrat", accessor: "contractEndDate" },
];

// Mechanical equipment specific columns
export const mechanicalColumns: ColumnDefinition[] = [
  ...commonColumns,
  { id: "supplierName", label: "Nom du fournisseur", accessor: "supplierName" },
  { id: "supplierNumber", label: "NO de fournisseur", accessor: "supplierNumber" },
  { id: "contacts", label: "Contacts", accessor: "contacts" },
  { id: "escalationNumber", label: "Numéro d'escalade", accessor: "escalationNumber" },
  { id: "email", label: "Courriel", accessor: "email" },
  { id: "manufacturer", label: "Manufacturier", accessor: "manufacturer" },
  { id: "serviceCompany", label: "Compagnie de service", accessor: "serviceCompany" },
  { id: "powerTon", label: "Puissance (Ton)", accessor: "powerTon" },
  { id: "isOver54T", label: "Unité de plus de 5.4T", accessor: "isOver54T" },
  { id: "lastLeakTest", label: "Dernier essai fuite", accessor: "lastLeakTest" },
  { id: "refrigerant", label: "Réfrigérant", accessor: "refrigerant" },
  { id: "refrigerantQuantity", label: "Quantité total de réfrigérant", accessor: "refrigerantQuantity" },
  { id: "stageCount", label: "Nombre de stage", accessor: "stageCount" },
  { id: "redundancy", label: "Redondance", accessor: "redundancy" },
  { id: "minorMaintenance", label: "Entretien mineur", accessor: "minorMaintenance" },
  { id: "majorMaintenance", label: "Entretien majeur", accessor: "majorMaintenance" },
  { id: "maintenanceComments", label: "Commentaire entretiens", accessor: "maintenanceComments" },
  { id: "coveredZone", label: "Zone couverte", accessor: "coveredZone" },
  { id: "filters", label: "Filtre(s)", accessor: "filters" },
  { id: "filterQuantity", label: "Quantité de filtre", accessor: "filterQuantity" },
  { id: "belts", label: "Courroie(s)", accessor: "belts" },
  { id: "beltQuantity", label: "Quantité de Courroie", accessor: "beltQuantity" },
  { id: "servicePassword", label: "Mot de passe de service", accessor: "servicePassword" },
  { id: "remoteAccessPassword", label: "Mot de passe accès à distance", accessor: "remoteAccessPassword" },
  { id: "ipAddress", label: "Adresse IP", accessor: "ipAddress" },
  { id: "gateway", label: "Gateway", accessor: "gateway" },
  { id: "netmask", label: "Netmask", accessor: "netmask" },
  { id: "switchPort", label: "Port de switch", accessor: "switchPort" },
  { id: "installerCompany", label: "Compagnie qui a installé l'équipement", accessor: "installerCompany" },
  { id: "serviceSheetNumber", label: "# de la fiche de mise en service", accessor: "serviceSheetNumber" },
];

// Inverter specific columns
export const inverterColumns: ColumnDefinition[] = [
  ...commonColumns,
  { id: "supplierName", label: "Nom du fournisseur", accessor: "supplierName" },
  { id: "supplierNumber", label: "NO de fournisseur", accessor: "supplierNumber" },
  { id: "contacts", label: "Contacts", accessor: "contacts" },
  { id: "escalationNumber", label: "Numéro d'escalade", accessor: "escalationNumber" },
  { id: "email", label: "Courriel", accessor: "email" },
  { id: "manufacturer", label: "Manufacturier", accessor: "manufacturer" },
  { id: "username", label: "Nom d'utilisateur", accessor: "username" },
  { id: "password", label: "Mot de passe", accessor: "password" },
  { id: "ipAddress", label: "Adresse IP", accessor: "ipAddress" },
  { id: "netmask", label: "Netmask", accessor: "netmask" },
  { id: "gateway", label: "Gateway", accessor: "gateway" },
  { id: "switchPort", label: "Port de switch", accessor: "switchPort" },
  { id: "voltage", label: "Tension", accessor: "voltage" },
  { id: "phaseCount", label: "Nb de phase", accessor: "phaseCount" },
  { id: "power", label: "Puissance (KW)", accessor: "power" },
  { id: "load", label: "Charge (KW)", accessor: "load" },
  { id: "usagePercentage", label: "% d'utilisation", accessor: "usagePercentage" },
  { id: "bypass", label: "Bypass (On/Off/n/a)", accessor: "bypass" },
];

// TSW specific columns
export const tswColumns: ColumnDefinition[] = [
  ...commonColumns,
  { id: "controllerModel", label: "Modèle du contrôleur", accessor: "controllerModel" },
  { id: "supplierName", label: "Nom du fournisseur", accessor: "supplierName" },
  { id: "supplierNumber", label: "NO de fournisseur", accessor: "supplierNumber" },
  { id: "contacts", label: "Contacts", accessor: "contacts" },
  { id: "escalationNumber", label: "Numéro d'escalade", accessor: "escalationNumber" },
  { id: "email", label: "Courriel", accessor: "email" },
  { id: "manufacturer", label: "Manufacturier", accessor: "manufacturer" },
  { id: "username", label: "Nom d'utilisateur", accessor: "username" },
  { id: "password", label: "Mot de passe", accessor: "password" },
  { id: "ipAddress", label: "Adresse IP", accessor: "ipAddress" },
  { id: "netmask", label: "Netmask", accessor: "netmask" },
  { id: "gateway", label: "Gateway", accessor: "gateway" },
  { id: "switchPort", label: "Port de switch", accessor: "switchPort" },
  { id: "voltage", label: "Tension", accessor: "voltage" },
  { id: "power", label: "Puissance", accessor: "power" },
  { id: "load", label: "Charge (KW)", accessor: "load" },
  { id: "loadPercentage", label: "% de charge", accessor: "loadPercentage" },
  { id: "hasBypass", label: "Présence bypass", accessor: "hasBypass" },
];

// Fire system specific columns
export const fireColumns: ColumnDefinition[] = [
  ...commonColumns,
  { id: "controllerModel", label: "Modèle du contrôleur", accessor: "controllerModel" },
  { id: "supplierName", label: "Nom du fournisseur", accessor: "supplierName" },
  { id: "supplierNumber", label: "NO de fournisseur", accessor: "supplierNumber" },
  { id: "contacts", label: "Contacts", accessor: "contacts" },
  { id: "escalationNumber", label: "Numéro d'escalade", accessor: "escalationNumber" },
  { id: "email", label: "Courriel", accessor: "email" },
  { id: "manufacturer", label: "Manufacturier", accessor: "manufacturer" },
  { id: "manometerDate", label: "Date manomètre", accessor: "manometerDate" },
  { id: "batteryInstallDate", label: "Date d'installation des batteries", accessor: "batteryInstallDate" },
  { id: "batteryType", label: "Type de batterie", accessor: "batteryType" },
  { id: "interlocking", label: "Entrebarrage (Simple, double, N/D)", accessor: "interlocking" },
  { id: "cyclicDelay", label: "Délai cyclique (minutes)", accessor: "cyclicDelay" },
  { id: "zoneType", label: "Zone simple ou croisée", accessor: "zoneType" },
  { id: "hasTestValve", label: "Présence de robinet d'essai", accessor: "hasTestValve" },
  { id: "pressureSignal", label: "Signal basse/très basse pression", accessor: "pressureSignal" },
  { id: "hasNameplate", label: "Plaque signalétique", accessor: "hasNameplate" },
  { id: "releasePanel", label: "Modèle du panneau de relâche", accessor: "releasePanel" },
  { id: "systemType", label: "Adressable ou conventionnel", accessor: "systemType" },
  { id: "sentContacts", label: "Contacts envoyés (A, T, S, E ou T&S)", accessor: "sentContacts" },
  { id: "installerCompany", label: "Compagnie qui a installé le système", accessor: "installerCompany" },
  { id: "mixingOrStop", label: "Mixing ou arrêt", accessor: "mixingOrStop" },
  { id: "lastHydrostaticTest", label: "Dernier test hydrostatique", accessor: "lastHydrostaticTest" },
  { id: "preactionAirLeakTest", label: "Date d'essai de fuite d'air Préaction", accessor: "preactionAirLeakTest" },
];

// DC System specific columns
export const dcSystemColumns: ColumnDefinition[] = [
  ...commonColumns,
  { id: "voltage", label: "Tension", accessor: "systemVoltage", renderCell: (row) => `${row.systemVoltage}V` },
  { id: "capacity", label: "Capacité", accessor: "baseCapacity", renderCell: (row) => `${row.baseCapacity}W` },
  { id: "ipAddress", label: "Adresse IP", accessor: "networkInfo", renderCell: (row) => row.networkInfo?.ipAddress || "-" },
  { id: "switchPort", label: "Port de switch", accessor: "networkInfo", renderCell: (row) => row.networkInfo?.switchPort || "-" },
  { id: "autonomy", label: "Autonomie", accessor: "autonomy", renderCell: (row) => `${row.autonomy?.toFixed(1) || 0}h` },
];

// Mapping to get column definitions by equipment type
export const getColumnsByType = (type: string): ColumnDefinition[] => {
  switch (type.toLowerCase()) {
    case "ups":
      return upsColumns;
    case "mécanique":
    case "mecanique":
      return mechanicalColumns;
    case "onduleur":
      return inverterColumns;
    case "tsw":
      return tswColumns;
    case "incendie":
      return fireColumns;
    case "système dc":
    case "systeme dc":
    case "dc":
      return dcSystemColumns;
    default:
      return commonColumns;
  }
};
