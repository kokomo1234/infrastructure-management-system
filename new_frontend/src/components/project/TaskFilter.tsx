
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { ViewFilter } from "@/types/project";

interface TaskFilterProps {
  filters: ViewFilter;
  onFiltersChange: (filters: ViewFilter) => void;
}

export function TaskFilter({ filters, onFiltersChange }: TaskFilterProps) {
  const updateFilter = (key: keyof ViewFilter, value: string[] | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value && value.length > 0 ? value : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(filter => 
    Array.isArray(filter) ? filter.length > 0 : !!filter
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Statut:</label>
            <Select
              value={filters.status?.[0] || ""}
              onValueChange={(value) => updateFilter('status', value ? [value] : undefined)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="todo">À faire</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Priorité:</label>
            <Select
              value={filters.priority?.[0] || ""}
              onValueChange={(value) => updateFilter('priority', value ? [value] : undefined)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Assigné à:</label>
            <Select
              value={filters.assignee?.[0] || ""}
              onValueChange={(value) => updateFilter('assignee', value ? [value] : undefined)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="user1">User 1</SelectItem>
                <SelectItem value="user2">User 2</SelectItem>
                <SelectItem value="user3">User 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.status?.map(status => (
              <Badge key={status} variant="secondary" className="gap-1">
                Statut: {status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('status', undefined)}
                />
              </Badge>
            ))}
            {filters.priority?.map(priority => (
              <Badge key={priority} variant="secondary" className="gap-1">
                Priorité: {priority}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('priority', undefined)}
                />
              </Badge>
            ))}
            {filters.assignee?.map(assignee => (
              <Badge key={assignee} variant="secondary" className="gap-1">
                Assigné à: {assignee}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('assignee', undefined)}
                />
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
