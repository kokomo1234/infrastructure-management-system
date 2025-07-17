
import { 
  CalendarEvent, 
  getEventsForDate, 
  addCalendarEvent, 
  updateCalendarEvent, 
  deleteCalendarEvent 
} from "@/lib/dataService";

export interface CalendarNote {
  id: string;
  date: string;
  title: string;
  content: string;
  type: 'note' | 'reminder';
  userId: string;
  createdAt: string;
}

// Conversion entre CalendarEvent et CalendarNote pour compatibilité
const convertEventToNote = (event: CalendarEvent): CalendarNote => ({
  id: event.id,
  date: event.date,
  title: event.title,
  content: event.description || '',
  type: event.type === 'note' ? 'note' : 'reminder',
  userId: event.userId || 'anonymous',
  createdAt: new Date().toISOString()
});

const convertNoteToEvent = (note: CalendarNote): Omit<CalendarEvent, 'id'> => ({
  date: note.date,
  title: note.title,
  type: 'note',
  userId: note.userId,
  color: '#8B5CF6',
  description: note.content
});

export const getNotesForDate = (date: Date): CalendarNote[] => {
  const events = getEventsForDate(date);
  return events
    .filter(event => event.type === 'note')
    .map(convertEventToNote);
};

export const addNote = (note: Omit<CalendarNote, 'id' | 'createdAt'>): CalendarNote => {
  const eventData = convertNoteToEvent({
    ...note,
    id: '',
    createdAt: new Date().toISOString()
  });
  
  const newEvent = addCalendarEvent(eventData);
  return convertEventToNote(newEvent);
};

export const deleteNote = (id: string): void => {
  deleteCalendarEvent(id);
};

export const updateNote = (id: string, updates: Partial<CalendarNote>): CalendarNote | null => {
  const eventUpdates: Partial<CalendarEvent> = {};
  
  if (updates.title) eventUpdates.title = updates.title;
  if (updates.content) eventUpdates.description = updates.content;
  if (updates.date) eventUpdates.date = updates.date;
  
  const updatedEvent = updateCalendarEvent(id, eventUpdates);
  return updatedEvent ? convertEventToNote(updatedEvent) : null;
};
