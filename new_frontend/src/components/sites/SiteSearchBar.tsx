
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import ViewSelector from "./ViewSelector";

interface SiteSearchBarProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openNewSiteDialog: () => void;
  currentView: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
}

const SiteSearchBar: React.FC<SiteSearchBarProps> = ({
  searchTerm,
  handleSearch,
  openNewSiteDialog,
  currentView,
  onViewChange
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center gap-4 w-full">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            placeholder="Rechercher des sites..."
            className="pl-10 w-full bg-white border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <Button 
          className="bg-primary hover:bg-primary/90 text-white transition-colors"
          onClick={openNewSiteDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau site
        </Button>

        <ViewSelector 
          currentView={currentView} 
          onViewChange={onViewChange} 
        />
      </div>
    </div>
  );
};

export default SiteSearchBar;
