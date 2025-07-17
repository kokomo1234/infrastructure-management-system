
import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { X, Check } from "lucide-react";
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from "@/components/ui/tooltip";
import { getStandbyForDate } from "@/lib/standbyService";
import { CalendarNote } from "./types";

interface DayCellProps {
  day: Date;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  showNoteEditor: boolean;
  setShowNoteEditor: React.Dispatch<React.SetStateAction<boolean>>;
  handleDayClick: (date: Date, modifiers: any, e: React.MouseEvent<HTMLButtonElement>) => void;
  notes: CalendarNote[];
  handleDeleteNote: (id: string) => void;
  newNote: string;
  setNewNote: React.Dispatch<React.SetStateAction<string>>;
  noteColor: string;
  setNoteColor: React.Dispatch<React.SetStateAction<string>>;
  handleAddNote: () => void;
  showAllStandby: boolean;
  availableColors: string[];
  getWeekColor: (date: Date) => string;
}

export function DayCell({
  day,
  selectedDate,
  setSelectedDate,
  showNoteEditor,
  setShowNoteEditor,
  handleDayClick,
  notes,
  handleDeleteNote,
  newNote,
  setNewNote,
  noteColor,
  setNoteColor,
  handleAddNote,
  showAllStandby,
  availableColors,
  getWeekColor,
}: DayCellProps) {
  const standbyPerson = getStandbyForDate(day);
  const dayNotes = notes.filter(
    note => new Date(note.date).toDateString() === day.toDateString()
  );
  
  const shouldShowStandby = showAllStandby || 
    (standbyPerson && standbyPerson.id === "user?.id"); // We'll get actual user ID from context
  
  // Get the week the day belongs to - start on Friday (5)
  const weekStart = new Date(day);
  while (weekStart.getDay() !== 5) { // 5 is Friday
    weekStart.setDate(weekStart.getDate() - 1);
  }
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekColor = getWeekColor(day);
  
  // Check if this is the middle of the standby week (Monday)
  const isMiddleOfWeek = day.getDay() === 1; // Monday
  
  // Check if standby person is assigned for the whole week
  const isFullWeekStandby = standbyPerson && 
                           standbyPerson.id === getStandbyForDate(weekStart)?.id && 
                           standbyPerson.id === getStandbyForDate(weekEnd)?.id;

  return (
    <div className="relative h-full w-full p-0 flex flex-col items-center justify-center">
      <div className="text-sm font-medium">{format(day, "d")}</div>
      
      {shouldShowStandby && standbyPerson && (
        <>
          {isFullWeekStandby && isMiddleOfWeek ? (
            // Display standby initials in the middle of the week (Monday)
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ 
                      backgroundColor: `${weekColor}88`,
                      zIndex: 1
                    }}
                  >
                    {standbyPerson.initials}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Garde: {standbyPerson.name} (semaine complète)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : !isFullWeekStandby && (
            // Display standby for single day with a square that takes up the whole day
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ 
                      backgroundColor: `${weekColor}88`,
                      zIndex: 1
                    }}
                  >
                    {standbyPerson.initials}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Garde: {standbyPerson.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      )}

      {dayNotes.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-0 left-0 flex -space-x-1 z-10">
                {dayNotes.slice(0, 2).map((note) => (
                  <div 
                    key={note.id} 
                    className="rounded-sm h-3 w-3 flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: note.color }}
                  />
                ))}
                {dayNotes.length > 2 && (
                  <div className="rounded-sm bg-gray-400 text-white text-[6px] font-bold h-3 w-3 flex items-center justify-center shadow-sm">
                    +{dayNotes.length - 2}
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="w-56 p-0">
              <div className="p-2 space-y-1">
                <p className="font-medium text-sm">{format(day, "d MMM yyyy", { locale: fr })}</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {dayNotes.map((note) => (
                    <div key={note.id} className="flex items-center justify-between text-sm p-1 rounded-sm hover:bg-muted">
                      <div className="flex items-center">
                        <div 
                          className="h-2 w-2 rounded-sm mr-2" 
                          style={{ backgroundColor: note.color }}
                        />
                        <span>{note.content}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Note editor */}
      {showNoteEditor && selectedDate && day.toDateString() === selectedDate.toDateString() && (
        <div className="absolute z-50 top-10 right-0 w-72 bg-white shadow-lg rounded-lg p-3 border">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">
              {format(day, "d MMMM yyyy", { locale: fr })}
            </h4>
            <button onClick={() => setShowNoteEditor(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <textarea
            className="w-full p-2 border rounded-md text-sm resize-none mb-2"
            rows={3}
            placeholder="Ajouter une note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            autoFocus
          />
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNoteColor(color)}
                  className={`w-5 h-5 rounded-full ${noteColor === color ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            <button
              onClick={handleAddNote}
              className="bg-infra-blue text-white rounded-md px-3 py-1 text-xs flex items-center"
              disabled={!newNote.trim()}
            >
              <Check className="h-3 w-3 mr-1" />
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
