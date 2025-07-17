
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteType } from "@/types/site";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import SiteList from "./SiteList";
import SiteGrid from "./SiteGrid";
import SiteSearchBar from "./SiteSearchBar";
import SitesDialogs from "./SitesDialogs";
import TDLDetailView from "./TDLDetailView";
import SiteDetailView from "./SiteDetailView";
import { useSites } from "@/hooks/useSites";
import { getVoltageOptions, classOptions } from "@/utils/siteUtils";

const SitesContainer: React.FC = () => {
  const {
    searchTerm,
    filteredSites,
    expandedSites,
    currentView,
    selectedSite,
    handleSearch,
    getStatusColor,
    toggleSiteExpansion,
    isSiteExpanded,
    handleAddTdl,
    handleNewSite,
    handleEditSite,
    handleViewChange,
    handleViewTDLDetails,
    handleBackToSites
  } = useSites();

  const [isTdlDialogOpen, setIsTdlDialogOpen] = useState(false);
  const [isNewSiteDialogOpen, setIsNewSiteDialogOpen] = useState(false);
  const [isEditSiteDialogOpen, setIsEditSiteDialogOpen] = useState(false);
  const [selectedComplex, setSelectedComplex] = useState<string | null>(null);
  const [selectedComplexPhase, setSelectedComplexPhase] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "tdl" | "detail">("list");
  const [selectedSiteForDetail, setSelectedSiteForDetail] = useState<SiteType | null>(null);

  // Initialize the TDL form
  const tdlForm = useForm({
    defaultValues: {
      name: "",
      phase: "",
      voltage: "",
      powerFactor: 0.9,
    }
  });

  // Initialize the new site form
  const newSiteForm = useForm({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      postalCode: "",
      class: classOptions[0],
      phase: "Monophasé",
      voltage: "120/240", // Add default voltage
    }
  });
  
  // Initialize the edit site form
  const editSiteForm = useForm({
    defaultValues: {
      id: "",
      name: "",
      address: "",
      city: "",
      postalCode: "",
      province: "",
      class: "",
      phase: "",
      voltage: "",
      powerFactor: 0.9,
      status: "Actif",
    }
  });

  // Update available voltage options based on the complex's phase
  useEffect(() => {
    if (selectedComplex) {
      const complex = filteredSites.find(site => site.id === selectedComplex);
      if (complex) {
        setSelectedComplexPhase(complex.phase);
        // Reset the phase when complex changes
        tdlForm.setValue("phase", complex.phase);
        // Also set the voltage from the complex
        tdlForm.setValue("voltage", complex.voltage);
      }
    }
  }, [selectedComplex, tdlForm, filteredSites]);

  const openTdlDialog = (complexId: string) => {
    setSelectedComplex(complexId);
    // Reset form when opening the dialog
    tdlForm.reset();
    setIsTdlDialogOpen(true);
  };
  
  const handleEditSiteAction = (site: SiteType) => {
    // Load site data into the edit form
    editSiteForm.reset({
      id: site.id,
      name: site.name,
      address: site.address,
      city: site.city,
      postalCode: site.postalCode,
      province: site.province,
      class: site.class,
      phase: site.phase,
      voltage: site.voltage,
      powerFactor: site.powerFactor,
      status: site.status
    });
    
    // Open the edit dialog
    setIsEditSiteDialogOpen(true);
  };

  const onTdlSubmit = (data: any) => {
    console.log("New TDL data:", { ...data, complexId: selectedComplex });
    
    if (!selectedComplex) {
      toast.error("Aucun complexe sélectionné");
      return;
    }
    
    const success = handleAddTdl({
      ...data,
      complexId: selectedComplex,
      phase: selectedComplexPhase
    });
    
    if (success) {
      // Show success message
      toast.success(`TDL "${data.name}" ajouté avec succès`);
      
      // Close dialog and reset state
      setIsTdlDialogOpen(false);
      setSelectedComplex(null);
      tdlForm.reset();
    }
  };

  const onNewSiteSubmit = (data: any) => {
    const success = handleNewSite(data);
    
    if (success) {
      // Show success message
      toast.success(`Site "${data.name}" ajouté avec succès`);
      
      // Close dialog and reset form
      setIsNewSiteDialogOpen(false);
      newSiteForm.reset();
    }
  };
  
  const onEditSiteSubmit = (data: any) => {
    const success = handleEditSite(data);
    
    if (success) {
      // Show success message
      toast.success(`Site "${data.name}" modifié avec succès`);
      
      // Close dialog and reset form
      setIsEditSiteDialogOpen(false);
      editSiteForm.reset();
    }
  };

  const openNewSiteDialog = () => {
    newSiteForm.reset({
      name: "",
      address: "",
      city: "",
      postalCode: "",
      class: classOptions[0],
      phase: "Monophasé",
      voltage: "120/240"
    });
    setIsNewSiteDialogOpen(true);
  };

  const handleViewSiteDetails = (site: SiteType) => {
    setSelectedSiteForDetail(site);
    setViewMode("detail");
  };
  
  const handleBackToList = () => {
    setSelectedSiteForDetail(null);
    setViewMode("list");
  };

  // If a site is selected for TDL details view
  if (selectedSite) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight">Sites</h2>
          <p className="text-muted-foreground">
            Gérez vos emplacements et les équipements associés.
          </p>
        </div>
        
        <TDLDetailView 
          site={selectedSite}
          onBack={handleBackToSites}
          getStatusColor={getStatusColor}
        />
      </div>
    );
  }

  // If a site is selected for detailed view
  if (viewMode === "detail" && selectedSiteForDetail) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight">Sites</h2>
          <p className="text-muted-foreground">
            Gérez vos emplacements et les équipements associés.
          </p>
        </div>
        
        <SiteDetailView 
          site={selectedSiteForDetail}
          onBack={handleBackToList}
          getStatusColor={getStatusColor}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Sites</h2>
        <p className="text-muted-foreground">
          Gérez vos emplacements et les équipements associés.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Liste des sites</CardTitle>
            <SiteSearchBar 
              searchTerm={searchTerm}
              handleSearch={handleSearch}
              openNewSiteDialog={openNewSiteDialog}
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {currentView === "list" ? (
            <SiteList 
              filteredSites={filteredSites}
              expandedSites={expandedSites}
              toggleSiteExpansion={toggleSiteExpansion}
              isSiteExpanded={isSiteExpanded}
              handleAddTdl={openTdlDialog}
              handleEditSite={handleEditSiteAction}
              getStatusColor={getStatusColor}
            />
          ) : (
            <div className="p-4">
              <SiteGrid 
                sites={filteredSites}
                getStatusColor={getStatusColor}
                handleAddTdl={openTdlDialog}
                handleEditSite={handleEditSiteAction}
                onViewTDLDetails={handleViewTDLDetails}
                onViewSiteDetails={handleViewSiteDetails}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <SitesDialogs 
        isTdlDialogOpen={isTdlDialogOpen}
        setIsTdlDialogOpen={setIsTdlDialogOpen}
        tdlForm={tdlForm}
        onTdlSubmit={onTdlSubmit}
        getVoltageOptions={getVoltageOptions}
        selectedComplexPhase={selectedComplexPhase}
        selectedComplex={selectedComplex}
        
        isNewSiteDialogOpen={isNewSiteDialogOpen}
        setIsNewSiteDialogOpen={setIsNewSiteDialogOpen}
        newSiteForm={newSiteForm}
        onNewSiteSubmit={onNewSiteSubmit}
        classOptions={classOptions}
        
        isEditSiteDialogOpen={isEditSiteDialogOpen}
        setIsEditSiteDialogOpen={setIsEditSiteDialogOpen}
        editSiteForm={editSiteForm}
        onEditSiteSubmit={onEditSiteSubmit}
      />
    </div>
  );
};

export default SitesContainer;
