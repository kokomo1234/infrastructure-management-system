
import { format, addDays, startOfWeek, endOfWeek, addWeeks, isAfter, isSameDay } from "date-fns";
import { getUsers, getUserById, getStandbyForDate as getStandbyFromData, User, addCalendarEvent, updateCalendarEvent } from "@/lib/dataService";

export interface StandbyPerson {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  color?: string;
  email: string;
  phone: string;
}

export interface StandbyAssignment {
  id: string;
  personId: string;
  startDate: Date;
  endDate: Date;
  type: 'week' | 'day';
  isFullWeek: boolean;
}

export interface StandbyChangeRequest {
  id: string;
  requesterId: string;
  requestedPersonId: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  message?: string;
}

export interface StandbyNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  type: 'request' | 'approval' | 'rejection' | 'admin' | 'system';
  relatedRequestId?: string;
}

// Données simulées pour les gardes
export const standbyAssignments: StandbyAssignment[] = [
  {
    id: "1",
    personId: "3",
    startDate: new Date(2025, 0, 13, 16, 0), // 13 Jan 2025 16:00
    endDate: new Date(2025, 0, 20, 7, 0),   // 20 Jan 2025 07:00
    type: 'week',
    isFullWeek: true
  },
  {
    id: "2", 
    personId: "4",
    startDate: new Date(2025, 0, 20, 16, 0), // 20 Jan 2025 16:00
    endDate: new Date(2025, 0, 27, 7, 0),   // 27 Jan 2025 07:00
    type: 'week',
    isFullWeek: true
  }
];

export const standbyChangeRequests: StandbyChangeRequest[] = [
  {
    id: "req1",
    requesterId: "3",
    requestedPersonId: "4",
    startDate: new Date(2025, 0, 15, 16, 0),
    endDate: new Date(2025, 0, 16, 7, 0),
    status: 'pending',
    createdAt: new Date(),
    message: "Urgence familiale"
  }
];

const standbyNotifications: StandbyNotification[] = [];

// Conversion des utilisateurs en personnes de garde
const convertUserToStandbyPerson = (user: User): StandbyPerson => ({
  id: user.id,
  name: user.name,
  initials: user.initials,
  avatar: user.avatar,
  color: getUserColor(user.id),
  email: user.email,
  phone: `514-555-${user.id.padStart(4, '0')}`
});

// Couleurs pour les utilisateurs (cohérent avec le système de calendrier)
const getUserColor = (userId: string): string => {
  const colors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", 
    "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
  ];
  const index = parseInt(userId) % colors.length;
  return colors[index];
};

export const getStandbyPeople = (): StandbyPerson[] => {
  return getUsers().map(convertUserToStandbyPerson);
};

// Compatibilité avec l'ancien nom
export const standbyPeople = getStandbyPeople();

export const getStandbyForDate = (date: Date): StandbyPerson | undefined => {
  const user = getStandbyFromData(date);
  return user ? convertUserToStandbyPerson(user) : undefined;
};

export const getStandbyPersonById = (id: string): StandbyPerson | undefined => {
  const user = getUserById(id);
  return user ? convertUserToStandbyPerson(user) : undefined;
};

// Alias pour compatibilité
export const getPersonById = getStandbyPersonById;

// Fonction pour obtenir les affectations de garde pour une semaine
export const getWeeklyStandbyAssignments = (startDate: Date): StandbyAssignment[] => {
  const assignments: StandbyAssignment[] = [];
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
  
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(weekStart, i);
    const standbyPerson = getStandbyForDate(currentDate);
    
    if (standbyPerson) {
      assignments.push({
        id: `${standbyPerson.id}-${format(currentDate, 'yyyy-MM-dd')}`,
        personId: standbyPerson.id,
        startDate: currentDate,
        endDate: currentDate,
        type: 'day',
        isFullWeek: false
      });
    }
  }
  
  return assignments;
};

// Nouvelles fonctions pour la compatibilité
export const getCurrentStandby = (): StandbyPerson | undefined => {
  return getStandbyForDate(new Date());
};

export const getNextStandby = (): StandbyPerson | undefined => {
  const nextWeek = addWeeks(new Date(), 1);
  return getStandbyForDate(nextWeek);
};

export const createDailyAssignment = (personId: string, date: Date): void => {
  const startDate = new Date(date);
  startDate.setHours(16, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(7, 0, 0, 0);
  
  const assignment: StandbyAssignment = {
    id: `daily-${Date.now()}`,
    personId,
    startDate,
    endDate,
    type: 'day',
    isFullWeek: false
  };
  
  standbyAssignments.push(assignment);
  
  // Ajouter au calendrier centralisé
  addCalendarEvent({
    date: format(date, 'yyyy-MM-dd'),
    title: `Garde - ${getStandbyPersonById(personId)?.name}`,
    type: 'standby',
    userId: personId,
    color: getUserColor(personId)
  });
};

export const createWeeklyAssignment = (personId: string, startDate: Date): void => {
  const weekStart = new Date(startDate);
  // Trouver le vendredi
  while (weekStart.getDay() !== 5) {
    weekStart.setDate(weekStart.getDate() + (startDate > weekStart ? 1 : -1));
  }
  weekStart.setHours(16, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  weekEnd.setHours(7, 0, 0, 0);
  
  const assignment: StandbyAssignment = {
    id: `weekly-${Date.now()}`,
    personId,
    startDate: weekStart,
    endDate: weekEnd,
    type: 'week',
    isFullWeek: true
  };
  
  standbyAssignments.push(assignment);
  
  // Ajouter au calendrier centralisé
  addCalendarEvent({
    date: format(weekStart, 'yyyy-MM-dd'),
    title: `Garde - ${getStandbyPersonById(personId)?.name}`,
    type: 'standby',
    userId: personId,
    color: getUserColor(personId)
  });
};

export const updateStandbyAssignment = (assignmentId: string, personId: string): void => {
  const index = standbyAssignments.findIndex(a => a.id === assignmentId);
  if (index !== -1) {
    standbyAssignments[index].personId = personId;
  }
};

export const requestStandbyChange = (
  requesterId: string, 
  requestedPersonId: string, 
  startDate: Date, 
  endDate: Date, 
  message?: string
): void => {
  const request: StandbyChangeRequest = {
    id: `req-${Date.now()}`,
    requesterId,
    requestedPersonId,
    startDate,
    endDate,
    status: 'pending',
    createdAt: new Date(),
    message
  };
  
  standbyChangeRequests.push(request);
  
  // Créer une notification
  const notification: StandbyNotification = {
    id: `notif-${Date.now()}`,
    userId: requestedPersonId,
    title: 'Demande de remplacement',
    message: `${getStandbyPersonById(requesterId)?.name} demande un remplacement`,
    isRead: false,
    createdAt: new Date(),
    type: 'request',
    relatedRequestId: request.id
  };
  
  standbyNotifications.push(notification);
};

export const respondToChangeRequest = (requestId: string, approved: boolean): boolean => {
  const index = standbyChangeRequests.findIndex(r => r.id === requestId);
  if (index === -1) return false;
  
  standbyChangeRequests[index].status = approved ? 'approved' : 'rejected';
  return true;
};

export const getUserNotifications = (userId: string): StandbyNotification[] => {
  return standbyNotifications.filter(n => n.userId === userId);
};

export const markNotificationAsRead = (notificationId: string): void => {
  const index = standbyNotifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    standbyNotifications[index].isRead = true;
  }
};

export const randomlyAssignStandby = (personIds: string[], startDate: Date, numberOfWeeks: number): StandbyAssignment[] => {
  const assignments: StandbyAssignment[] = [];
  const shuffledPersons = [...personIds].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < numberOfWeeks; i++) {
    const personIndex = i % shuffledPersons.length;
    const weekStart = addWeeks(startDate, i);
    
    createWeeklyAssignment(shuffledPersons[personIndex], weekStart);
    
    const assignment = standbyAssignments[standbyAssignments.length - 1];
    assignments.push(assignment);
  }
  
  return assignments;
};

export { getUserColor };
