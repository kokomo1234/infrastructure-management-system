
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ViewSelectorProps {
  currentView: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  currentView,
  onViewChange
}) => {
  return (
    <Tabs 
      value={currentView} 
      onValueChange={(value) => onViewChange(value as "list" | "grid")}
      className="bg-white border border-slate-300 rounded-md"
    >
      <TabsList className="bg-transparent">
        <TabsTrigger 
          value="list" 
          className={`flex items-center ${
            currentView === 'list' 
              ? 'bg-primary text-white' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <List className="h-4 w-4 mr-2" />
          Liste
        </TabsTrigger>
        <TabsTrigger 
          value="grid" 
          className={`flex items-center ${
            currentView === 'grid' 
              ? 'bg-primary text-white' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Grille
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ViewSelector;
