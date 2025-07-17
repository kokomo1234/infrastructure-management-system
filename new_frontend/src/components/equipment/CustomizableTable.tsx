
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Settings, 
  GripVertical, 
  MoreHorizontal, 
  ArrowUp, 
  ArrowDown,
  Save
} from "lucide-react";
import { toast } from "sonner";

export interface ColumnDefinition {
  id: string;
  label: string;
  accessor: string;
  isVisible?: boolean;
  width?: string;
  renderCell?: (row: any) => React.ReactNode;
}

interface CustomizableTableProps {
  data: any[];
  defaultColumns: ColumnDefinition[];
  equipmentType: string;
  onRowClick?: (row: any) => void;
  getStatusColor?: (status: string) => string;
  actionMenu?: (row: any) => React.ReactNode;
}

const COLUMN_PREFERENCES_KEY = "equipment-columns-preferences";

const CustomizableTable: React.FC<CustomizableTableProps> = ({
  data,
  defaultColumns,
  equipmentType,
  onRowClick,
  getStatusColor,
  actionMenu
}) => {
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);

  useEffect(() => {
    const loadColumns = () => {
      try {
        const savedPreferences = localStorage.getItem(COLUMN_PREFERENCES_KEY);
        if (savedPreferences) {
          const allPreferences = JSON.parse(savedPreferences);
          const typePreferences = allPreferences[equipmentType];
          
          if (typePreferences) {
            // Map saved preferences back to full column definitions
            const savedColumns = defaultColumns.map(defaultCol => {
              const savedCol = typePreferences.find((col: ColumnDefinition) => col.id === defaultCol.id);
              return {
                ...defaultCol,
                isVisible: savedCol ? savedCol.isVisible : defaultCol.isVisible !== false,
              };
            });
            
            // Sort columns according to saved order
            savedColumns.sort((a, b) => {
              const aIndex = typePreferences.findIndex((col: ColumnDefinition) => col.id === a.id);
              const bIndex = typePreferences.findIndex((col: ColumnDefinition) => col.id === b.id);
              return aIndex - bIndex;
            });
            
            setColumns(savedColumns);
            return;
          }
        }
      } catch (error) {
        console.error("Error loading column preferences:", error);
      }
      
      // If no saved preferences or error, use default columns
      setColumns(defaultColumns.map(col => ({ ...col, isVisible: col.isVisible !== false })));
    };

    loadColumns();
  }, [equipmentType, defaultColumns]);

  const visibleColumns = columns.filter(col => col.isVisible);

  const handleColumnToggle = (columnId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
    ));
  };

  const moveColumn = (columnId: string, direction: 'up' | 'down') => {
    const columnIndex = columns.findIndex(col => col.id === columnId);
    if (
      (direction === 'up' && columnIndex === 0) || 
      (direction === 'down' && columnIndex === columns.length - 1)
    ) {
      return;
    }

    const newColumns = [...columns];
    const targetIndex = direction === 'up' ? columnIndex - 1 : columnIndex + 1;
    
    // Swap the columns
    [newColumns[columnIndex], newColumns[targetIndex]] = 
      [newColumns[targetIndex], newColumns[columnIndex]];
    
    setColumns(newColumns);
  };

  const saveColumnPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem(COLUMN_PREFERENCES_KEY);
      const allPreferences = savedPreferences ? JSON.parse(savedPreferences) : {};
      
      // Save only id, label, and isVisible
      const simplifiedColumns = columns.map(({ id, label, isVisible }) => ({ id, label, isVisible }));
      
      allPreferences[equipmentType] = simplifiedColumns;
      localStorage.setItem(COLUMN_PREFERENCES_KEY, JSON.stringify(allPreferences));
      
      toast.success("Configuration des colonnes sauvegardée");
      setIsColumnDialogOpen(false);
    } catch (error) {
      console.error("Error saving column preferences:", error);
      toast.error("Erreur lors de la sauvegarde des préférences de colonnes");
    }
  };

  const resetToDefaults = () => {
    setColumns(defaultColumns.map(col => ({ ...col, isVisible: col.isVisible !== false })));
    toast.info("Colonnes réinitialisées aux valeurs par défaut");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsColumnDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Settings className="h-4 w-4" />
          <span>Colonnes</span>
        </Button>
      </div>

      <div className="bg-white rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map(column => (
                  <TableHead 
                    key={column.id} 
                    className={column.width}
                  >
                    {column.label}
                  </TableHead>
                ))}
                {actionMenu && <TableHead className="w-[80px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow 
                    key={row.id || index}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={onRowClick ? "cursor-pointer" : ""}
                  >
                    {visibleColumns.map(column => (
                      <TableCell key={`${row.id || index}-${column.id}`}>
                        {column.renderCell 
                          ? column.renderCell(row)
                          : column.accessor === "status" && getStatusColor
                            ? (
                                <Badge variant="outline" className={getStatusColor(row[column.accessor])}>
                                  {row[column.accessor]}
                                </Badge>
                              )
                            : Array.isArray(row[column.accessor])
                              ? row[column.accessor].join(", ")
                              : typeof row[column.accessor] === 'boolean'
                                ? row[column.accessor] ? "Oui" : "Non"
                                : row[column.accessor] || "-"}
                      </TableCell>
                    ))}
                    {actionMenu && (
                      <TableCell>
                        {actionMenu(row)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={visibleColumns.length + (actionMenu ? 1 : 0)} 
                    className="h-24 text-center"
                  >
                    Aucun équipement trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Configuration des colonnes</DialogTitle>
            <DialogDescription>
              Sélectionnez les colonnes à afficher et leur ordre d'apparition.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {columns.map((column) => (
                <div key={column.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`column-${column.id}`}
                        checked={column.isVisible}
                        onCheckedChange={() => handleColumnToggle(column.id)}
                      />
                      <label 
                        htmlFor={`column-${column.id}`}
                        className={`text-sm ${!column.isVisible ? "text-gray-500" : ""}`}
                      >
                        {column.label}
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => moveColumn(column.id, 'up')}
                      className="h-8 w-8"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => moveColumn(column.id, 'down')}
                      className="h-8 w-8"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={resetToDefaults}
            >
              Réinitialiser
            </Button>
            <Button 
              onClick={saveColumnPreferences}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomizableTable;
