
// Service centralisé pour gérer toutes les données du site
import { format } from "date-fns";

// Types centralisés
export interface User {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  position: string;
  email: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  siteId: string;
  status: 'operational' | 'maintenance' | 'offline';
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'standby' | 'maintenance' | 'project' | 'vacation' | 'note';
  userId?: string;
  siteId?: string;
  equipmentId?: string;
  color: string;
  description?: string;
}

// Données centralisées
const users: User[] = [
  { id: "1", name: "Admin User", initials: "AU", position: "Administrateur", email: "admin@infra.com" },
  { id: "2", name: "Jean Dupont", initials: "JD", position: "Superviseur", email: "jean.dupont@infra.com" },
  { id: "3", name: "Marie Tremblay", initials: "MT", position: "Technicien", email: "marie.tremblay@infra.com" },
  { id: "4", name: "Pierre Leblanc", initials: "PL", position: "Technicien", email: "pierre.leblanc@infra.com" },
  { id: "5", name: "Sophie Martin", initials: "SM", position: "Technicien", email: "sophie.martin@infra.com" }
];

const sites: Site[] = [
  { id: "site1", name: "Site A - Bâtiment Principal", address: "123 Rue des Érables", city: "Montréal", region: "Québec" },
  { id: "site2", name: "Site B - Datacenter", address: "456 Avenue Tech", city: "Québec", region: "Québec" },
  { id: "site3", name: "Site C - Bureau Nord", address: "789 Boulevard Nord", city: "Laval", region: "Québec" },
];

const equipment: Equipment[] = [
  { id: "eq1", name: "UPS-001", type: "UPS", siteId: "site1", status: "operational" },
  { id: "eq2", name: "UPS-002", type: "UPS", siteId: "site2", status: "maintenance" },
  { id: "eq3", name: "RECTIFIER-001", type: "Rectifier", siteId: "site1", status: "operational" },
];

let calendarEvents: CalendarEvent[] = [
  {
    id: "1",
    date: "2025-01-15",
    title: "Garde - Marie Tremblay",
    type: "standby",
    userId: "3",
    color: "#3B82F6"
  },
  {
    id: "2",
    date: "2025-01-16",
    title: "Maintenance UPS-001",
    type: "maintenance",
    userId: "4",
    siteId: "site1",
    equipmentId: "eq1",
    color: "#F59E0B"
  },
  {
    id: "3",
    date: "2025-01-20",
    title: "Réunion projet Alpha",
    type: "project",
    color: "#10B981"
  }
];

// Fonctions pour accéder aux données
export const getUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined => 
  users.find(user => user.id === id);

export const getSites = (): Site[] => sites;

export const getSiteById = (id: string): Site | undefined =>
  sites.find(site => site.id === id);

export const getEquipment = (): Equipment[] => equipment;

export const getEquipmentById = (id: string): Equipment | undefined =>
  equipment.find(eq => eq.id === id);

export const getEquipmentBySite = (siteId: string): Equipment[] =>
  equipment.filter(eq => eq.siteId === siteId);

export const getCalendarEvents = (): CalendarEvent[] => calendarEvents;

export const getEventsForDate = (date: Date): CalendarEvent[] => {
  const dateStr = format(date, "yyyy-MM-dd");
  return calendarEvents.filter(event => event.date === dateStr);
};

export const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>): CalendarEvent => {
  const newEvent: CalendarEvent = {
    ...event,
    id: Date.now().toString()
  };
  calendarEvents.push(newEvent);
  return newEvent;
};

export const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>): CalendarEvent | null => {
  const index = calendarEvents.findIndex(event => event.id === id);
  if (index === -1) return null;
  
  calendarEvents[index] = { ...calendarEvents[index], ...updates };
  return calendarEvents[index];
};

export const deleteCalendarEvent = (id: string): void => {
  calendarEvents = calendarEvents.filter(event => event.id !== id);
};

// Fonctions pour la cohérence des données
export const getStandbyForDate = (date: Date): User | undefined => {
  const dateStr = format(date, "yyyy-MM-dd");
  const standbyEvent = calendarEvents.find(event => 
    event.date === dateStr && event.type === 'standby' && event.userId
  );
  return standbyEvent ? getUserById(standbyEvent.userId!) : undefined;
};

export const getMaintenanceForDate = (date: Date): CalendarEvent[] => {
  const dateStr = format(date, "yyyy-MM-dd");
  return calendarEvents.filter(event => 
    event.date === dateStr && event.type === 'maintenance'
  );
};
