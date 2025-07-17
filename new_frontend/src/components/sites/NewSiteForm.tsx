
import React, { useEffect } from "react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DialogFooter
} from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface NewSiteFormProps {
  newSiteForm: UseFormReturn<any, any>; // Using any to handle both new site and edit site forms
  onNewSiteSubmit: (data: any) => void;
  classOptions: string[];
  onCancel: () => void;
  getVoltageOptions: (phase: string) => Array<{value: string, label: string}>;
  isEditMode?: boolean;
}

const NewSiteForm: React.FC<NewSiteFormProps> = ({
  newSiteForm,
  onNewSiteSubmit,
  classOptions,
  onCancel,
  getVoltageOptions,
  isEditMode = false
}) => {
  // Watch the phase field to update voltage options
  const phase = newSiteForm.watch("phase");
  
  // Update voltage options when phase changes
  useEffect(() => {
    if (phase && !isEditMode) {
      const voltageOptions = getVoltageOptions(phase);
      if (voltageOptions.length > 0) {
        newSiteForm.setValue("voltage", voltageOptions[0].value);
      }
    }
  }, [phase, newSiteForm, getVoltageOptions, isEditMode]);
  
  return (
    <Form {...newSiteForm}>
      <form onSubmit={newSiteForm.handleSubmit(onNewSiteSubmit)} className="space-y-4">
        <FormField
          control={newSiteForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={newSiteForm.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={newSiteForm.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={newSiteForm.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code postal</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isEditMode && (
          <FormField
            control={newSiteForm.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={newSiteForm.control}
          name="class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une classe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={newSiteForm.control}
          name="phase"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Phase</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-6"
                  value={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Monophasé" id="monophase" />
                    <Label htmlFor="monophase">Monophasé</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Triphasé" id="triphase" />
                    <Label htmlFor="triphase">Triphasé</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Add voltage selection for complexes */}
        <FormField
          control={newSiteForm.control}
          name="voltage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tension</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la tension" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getVoltageOptions(phase || "Monophasé").map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isEditMode && (
          <>
            <FormField
              control={newSiteForm.control}
              name="powerFactor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facteur de puissance</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="1" 
                      value={field.value}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={newSiteForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="Inactif">Inactif</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NewSiteForm;
