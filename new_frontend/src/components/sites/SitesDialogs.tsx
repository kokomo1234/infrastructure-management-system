
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import TDLForm from "./TDLForm";
import NewSiteForm from "./NewSiteForm";
import { UseFormReturn } from "react-hook-form";

interface SitesDialogsProps {
  // TDL Dialog props
  isTdlDialogOpen: boolean;
  setIsTdlDialogOpen: (open: boolean) => void;
  tdlForm: UseFormReturn<{
    name: string;
    phase: string;
    voltage: string;
    powerFactor: number;
  }, any>;
  onTdlSubmit: (data: any) => void;
  getVoltageOptions: (phase: string) => Array<{value: string, label: string}>;
  selectedComplexPhase: string;
  selectedComplex: string | null;
  
  // New Site Dialog props
  isNewSiteDialogOpen: boolean;
  setIsNewSiteDialogOpen: (open: boolean) => void;
  newSiteForm: UseFormReturn<{
    name: string;
    address: string;
    city: string;
    postalCode: string;
    class: string;
    phase: string;
    voltage: string; // Added voltage field
  }, any>;
  onNewSiteSubmit: (data: any) => void;
  classOptions: string[];
  
  // Edit site dialog props
  isEditSiteDialogOpen: boolean;
  setIsEditSiteDialogOpen: (open: boolean) => void;
  editSiteForm: UseFormReturn<{
    id: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    province: string;
    class: string;
    phase: string;
    voltage: string;
    powerFactor: number;
    status: string;
  }, any>;
  onEditSiteSubmit: (data: any) => void;
}

const SitesDialogs: React.FC<SitesDialogsProps> = ({
  isTdlDialogOpen,
  setIsTdlDialogOpen,
  tdlForm,
  onTdlSubmit,
  getVoltageOptions,
  selectedComplexPhase,
  selectedComplex,
  
  isNewSiteDialogOpen,
  setIsNewSiteDialogOpen,
  newSiteForm,
  onNewSiteSubmit,
  classOptions,
  
  isEditSiteDialogOpen,
  setIsEditSiteDialogOpen,
  editSiteForm,
  onEditSiteSubmit
}) => {
  const handleTdlCancel = () => {
    setIsTdlDialogOpen(false);
    tdlForm.reset();
  };

  const handleNewSiteCancel = () => {
    setIsNewSiteDialogOpen(false);
    newSiteForm.reset();
  };
  
  const handleEditSiteCancel = () => {
    setIsEditSiteDialogOpen(false);
    editSiteForm.reset();
  };

  return (
    <>
      {/* TDL Dialog */}
      <Dialog 
        open={isTdlDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              tdlForm.reset();
            }, 100);
          }
          setIsTdlDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle salle TDL</DialogTitle>
            <DialogDescription>
              Remplissez les détails pour ajouter une nouvelle salle TDL au complexe.
            </DialogDescription>
          </DialogHeader>
          
          <TDLForm 
            tdlForm={tdlForm}
            onTdlSubmit={onTdlSubmit}
            getVoltageOptions={getVoltageOptions}
            selectedComplexPhase={selectedComplexPhase}
            onCancel={handleTdlCancel}
          />
        </DialogContent>
      </Dialog>

      {/* New Site Dialog */}
      <Dialog 
        open={isNewSiteDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              newSiteForm.reset();
            }, 100);
          }
          setIsNewSiteDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau site</DialogTitle>
            <DialogDescription>
              Remplissez les détails pour ajouter un nouvel emplacement au système.
            </DialogDescription>
          </DialogHeader>
          
          <NewSiteForm 
            newSiteForm={newSiteForm}
            onNewSiteSubmit={onNewSiteSubmit}
            classOptions={classOptions}
            onCancel={handleNewSiteCancel}
            getVoltageOptions={getVoltageOptions}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Site Dialog */}
      <Dialog 
        open={isEditSiteDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              editSiteForm.reset();
            }, 100);
          }
          setIsEditSiteDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le site</DialogTitle>
            <DialogDescription>
              Modifiez les informations du site.
            </DialogDescription>
          </DialogHeader>
          
          <NewSiteForm 
            newSiteForm={editSiteForm}
            onNewSiteSubmit={onEditSiteSubmit}
            classOptions={classOptions}
            onCancel={handleEditSiteCancel}
            getVoltageOptions={getVoltageOptions}
            isEditMode={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SitesDialogs;
