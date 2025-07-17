
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterControlsProps {
  yearFilter: string;
  periodFilter: string;
  onYearFilterChange: (value: string) => void;
  onPeriodFilterChange: (value: string) => void;
}

export function FilterControls({
  yearFilter,
  periodFilter,
  onYearFilterChange,
  onPeriodFilterChange
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h3 className="text-lg font-medium">Progrès de la maintenance</h3>
      
      <div className="flex gap-4">
        <Select value={yearFilter} onValueChange={onYearFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={periodFilter} onValueChange={onPeriodFilterChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
