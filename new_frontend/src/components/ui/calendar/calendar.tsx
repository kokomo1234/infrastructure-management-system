
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { CalendarProps, CalendarNote } from "./types";
import { DayCell } from "./day-cell";
import { availableColors, getWeekColor } from "./color-utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  showAllStandby = true,
  onDayClick,
  ...props
}: CalendarProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<CalendarNote[]>([
    {
      id: "1",
      date: new Date(2025, 3, 15),
      content: "Maintenance UPS",
      userId: "user1",
      color: "#F59E0B",
    },
    {
      id: "2",
      date: new Date(2025, 3, 20),
      content: "Réunion équipe",
      userId: "user1",
      color: "#3B82F6",
    }
  ]);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newNote, setNewNote] = useState("");
  const [noteColor, setNoteColor] = useState("#3B82F6");
  
  const handleDayClick = (day: Date, modifiers: any, e: React.MouseEvent<HTMLButtonElement>) => {
    if (onDayClick) {
      onDayClick(day, modifiers, e);
    }
    
    setSelectedDate(day);
    setShowNoteEditor(true);
  };

  const handleAddNote = () => {
    if (selectedDate && newNote.trim()) {
      const newNoteItem: CalendarNote = {
        id: Date.now().toString(),
        date: selectedDate,
        content: newNote.trim(),
        userId: user?.id || "anonymous",
        color: noteColor
      };
      setNotes([...notes, newNoteItem]);
      setNewNote("");
      setShowNoteEditor(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Create a modified props object that's compatible with DayPicker
  const dayPickerProps = {
    ...props,
    showOutsideDays,
    locale: fr,
    weekStartsOn: 5 as const, // 5 is Friday
  };

  return (
    <DayPicker
      {...dayPickerProps}
      className={cn("p-3 pointer-events-auto w-full h-full", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "relative h-9 w-9 text-center text-sm p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/80 hover:text-accent-foreground transition-colors"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-semibold",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Day: ({ date, ...dayProps }) => (
          <button {...dayProps} className="relative group h-full w-full" onClick={(e) => {
            // Handle day click with proper arguments
            if (handleDayClick) {
              // Pass empty object for modifiers to avoid type errors
              handleDayClick(date, {}, e);
            }
          }}>
            <DayCell 
              day={date}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              showNoteEditor={showNoteEditor}
              setShowNoteEditor={setShowNoteEditor}
              handleDayClick={handleDayClick}
              notes={notes}
              handleDeleteNote={handleDeleteNote}
              newNote={newNote}
              setNewNote={setNewNote}
              noteColor={noteColor}
              setNoteColor={setNoteColor}
              handleAddNote={handleAddNote}
              showAllStandby={showAllStandby}
              availableColors={availableColors}
              getWeekColor={getWeekColor}
            />
          </button>
        ),
      }}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
