
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarNote, addNote, deleteNote, getNotesForDate } from "@/lib/calendarNotesService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CalendarNoteDialogProps {
  date: Date;
  onNoteAdded: () => void;
}

export function CalendarNoteDialog({ date, onNoteAdded }: CalendarNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<'note' | 'reminder'>('note');
  const [existingNotes, setExistingNotes] = useState<CalendarNote[]>([]);
  const { user } = useAuth();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setExistingNotes(getNotesForDate(date));
    }
  };

  const handleAddNote = () => {
    if (!title.trim() || !user) return;

    addNote({
      date: date.toISOString().split('T')[0],
      title: title.trim(),
      content: content.trim(),
      type,
      userId: user.id
    });

    setTitle("");
    setContent("");
    setType('note');
    setExistingNotes(getNotesForDate(date));
    onNoteAdded();
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    setExistingNotes(getNotesForDate(date));
    onNoteAdded();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <StickyNote className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Notes pour le {format(date, "d MMMM yyyy", { locale: fr })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Notes existantes */}
          {existingNotes.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Notes existantes</Label>
              {existingNotes.map((note) => (
                <div key={note.id} className="p-2 bg-muted rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{note.title}</h4>
                      {note.content && (
                        <p className="text-xs text-muted-foreground mt-1">{note.content}</p>
                      )}
                      <span className="text-xs text-blue-600 capitalize">{note.type}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ajouter une nouvelle note */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ajouter une note</Label>
            
            <div>
              <Label htmlFor="title" className="text-xs">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la note..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-xs">Contenu</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Détails..."
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-xs">Type</Label>
              <Select value={type} onValueChange={(value: 'note' | 'reminder') => setType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="reminder">Rappel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleAddNote} 
              disabled={!title.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter la note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
