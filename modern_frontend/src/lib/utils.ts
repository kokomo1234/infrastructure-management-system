import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for the infrastructure management system
export const formatCapacity = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  
  // Convert to number and validate
  const numValue = Number(value);
  if (isNaN(numValue)) return 'N/A';
  
  return `${numValue.toFixed(1)} kW`;
};

export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  
  // Convert to number and validate
  const numValue = Number(value);
  if (isNaN(numValue)) return 'N/A';
  
  return `${numValue}%`;
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'actif':
    case 'active':
    case 'operational':
      return 'text-green-600 bg-green-100';
    case 'maintenance':
    case 'en maintenance':
      return 'text-yellow-600 bg-yellow-100';
    case 'hors service':
    case 'offline':
    case 'down':
      return 'text-red-600 bg-red-100';
    case 'standby':
    case 'en attente':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'critical':
    case 'critique':
      return 'text-red-600 bg-red-100';
    case 'high':
    case 'élevé':
    case 'haute':
      return 'text-orange-600 bg-orange-100';
    case 'medium':
    case 'moyen':
    case 'moyenne':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
    case 'faible':
    case 'basse':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Date invalide';
  }
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Date invalide';
  }
};

export const calculateUtilization = (used: number | null, total: number | null): number => {
  if (!used || !total || total === 0) return 0;
  return Math.round((used / total) * 100);
};

export const getUtilizationColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-red-600';
  if (percentage >= 75) return 'text-orange-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-green-600';
};

// French translations for common terms
export const translations = {
  // Status translations
  status: {
    active: 'Actif',
    inactive: 'Inactif',
    maintenance: 'Maintenance',
    offline: 'Hors ligne',
    online: 'En ligne',
    standby: 'En attente',
  },
  // Priority translations
  priority: {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    critical: 'Critique',
  },
  // Equipment types
  equipment: {
    ups: 'UPS',
    ond: 'OND',
    generator: 'Générateur',
    hvac: 'HVAC',
    dc: 'Système DC',
    battery: 'Batterie',
    rectifier: 'Redresseur',
    inverter: 'Onduleur',
  },
  // Common actions
  actions: {
    create: 'Créer',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    view: 'Voir',
    details: 'Détails',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    refresh: 'Actualiser',
  },
  // Navigation
  navigation: {
    dashboard: 'Tableau de bord',
    sites: 'Sites',
    equipment: 'Équipements',
    workOrders: 'Ordres de travail',
    maintenance: 'Maintenance',
    contractors: 'Contractants',
    users: 'Utilisateurs',
    settings: 'Paramètres',
    reports: 'Rapports',
    administration: 'Administration',
  },
};

export const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  
  return value || key;
};
