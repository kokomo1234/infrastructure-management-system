
import React from "react";
import { useForm } from "react-hook-form";

// Context for form state
export const SiteFormContext = React.createContext<{
  tdlForm: any;
  newSiteForm: any;
  editSiteForm: any;
}>({
  tdlForm: null,
  newSiteForm: null,
  editSiteForm: null
});

export const SiteFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      class: "1",
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

  return (
    <SiteFormContext.Provider value={{ tdlForm, newSiteForm, editSiteForm }}>
      {children}
    </SiteFormContext.Provider>
  );
};

export const useSiteForms = () => {
  const context = React.useContext(SiteFormContext);
  if (context === undefined) {
    throw new Error("useSiteForms must be used within a SiteFormProvider");
  }
  return context;
};
