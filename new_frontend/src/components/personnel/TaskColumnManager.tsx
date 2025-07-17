
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, X } from "lucide-react";

export interface TaskColumn {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  options?: string[];
  required?: boolean;
}

interface TaskColumnManagerProps {
  columns: TaskColumn[];
  onColumnsChange: (columns: TaskColumn[]) => void;
}

export function TaskColumnManager({ columns, onColumnsChange }: TaskColumnManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newColumn, setNewColumn] = useState<Partial<TaskColumn>>({
    label: "",
    type: "text",
    required: false
  });

  const addColumn = () => {
    if (!newColumn.label) return;
    
    const column: TaskColumn = {
      id: `col_${Date.now()}`,
      label: newColumn.label,
      type: newColumn.type as TaskColumn["type"],
      options: newColumn.options,
      required: newColumn.required || false
    };
    
    onColumnsChange([...columns, column]);
    setNewColumn({ label: "", type: "text", required: false });
  };

  const removeColumn = (columnId: string) => {
    onColumnsChange(columns.filter(col => col.id !== columnId));
  };

  const addOption = () => {
    if (!newColumn.options) {
      setNewColumn({ ...newColumn, options: [""] });
    } else {
      setNewColumn({ ...newColumn, options: [...newColumn.options, ""] });
    }
  };

  const updateOption = (index: number, value: string) => {
    if (!newColumn.options) return;
    const updatedOptions = [...newColumn.options];
    updatedOptions[index] = value;
    setNewColumn({ ...newColumn, options: updatedOptions });
  };

  const removeOption = (index: number) => {
    if (!newColumn.options) return;
    const updatedOptions = newColumn.options.filter((_, i) => i !== index);
    setNewColumn({ ...newColumn, options: updatedOptions });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Gérer les colonnes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestion des colonnes personnalisées</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Colonnes existantes */}
          <div>
            <h4 className="text-sm font-medium mb-3">Colonnes actuelles</h4>
            <div className="space-y-2">
              {columns.map(column => (
                <div key={column.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{column.label}</span>
                    <Badge variant="secondary">{column.type}</Badge>
                    {column.required && <Badge variant="outline">Requis</Badge>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColumn(column.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Ajouter nouvelle colonne */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Ajouter une colonne</h4>
            <div className="space-y-4">
              <div>
                <Label>Nom de la colonne</Label>
                <Input
                  value={newColumn.label || ""}
                  onChange={(e) => setNewColumn({ ...newColumn, label: e.target.value })}
                  placeholder="Ex: Nom du tech, Site, Adresse..."
                />
              </div>
              
              <div>
                <Label>Type de données</Label>
                <Select 
                  value={newColumn.type} 
                  onValueChange={(value) => setNewColumn({ ...newColumn, type: value as TaskColumn["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texte</SelectItem>
                    <SelectItem value="select">Liste déroulante</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="number">Nombre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newColumn.type === "select" && (
                <div>
                  <Label>Options de la liste</Label>
                  <div className="space-y-2">
                    {newColumn.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder="Option..."
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addOption}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter option
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={newColumn.required || false}
                  onChange={(e) => setNewColumn({ ...newColumn, required: e.target.checked })}
                />
                <Label htmlFor="required">Champ obligatoire</Label>
              </div>

              <Button onClick={addColumn} disabled={!newColumn.label}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter la colonne
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
