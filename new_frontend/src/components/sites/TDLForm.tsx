
import React from "react";
import { 
  Form, 
  FormControl, 
  FormDescription, 
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

interface TDLFormProps {
  tdlForm: UseFormReturn<{
    name: string;
    phase: string;
    voltage: string;
    powerFactor: number;
  }, any>;
  onTdlSubmit: (data: any) => void;
  getVoltageOptions: (phase: string) => Array<{value: string, label: string}>;
  selectedComplexPhase: string;
  onCancel: () => void;
}

const TDLForm: React.FC<TDLFormProps> = ({
  tdlForm,
  onTdlSubmit,
  getVoltageOptions,
  selectedComplexPhase,
  onCancel
}) => {
  return (
    <Form {...tdlForm}>
      <form onSubmit={tdlForm.handleSubmit(onTdlSubmit)} className="space-y-4">
        <FormField
          control={tdlForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la salle</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nom de la salle TDL" />
              </FormControl>
              <FormDescription>
                Entrez un nom descriptif pour la salle TDL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={tdlForm.control}
          name="phase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phase</FormLabel>
              <FormControl>
                <Input value={selectedComplexPhase} disabled className="bg-gray-100" />
              </FormControl>
              <FormDescription>
                La phase est déterminée par le complexe parent.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={tdlForm.control}
          name="voltage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tension</FormLabel>
              <FormControl>
                <Input value={field.value} disabled className="bg-gray-100" />
              </FormControl>
              <FormDescription>
                La tension est déterminée par le complexe parent.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={tdlForm.control}
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
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                />
              </FormControl>
              <FormDescription>
                Valeur entre 0 et 1, par exemple 0.95
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TDLForm;
