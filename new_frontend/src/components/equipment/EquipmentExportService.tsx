
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  location: string;
  installDate: string;
  status: string;
  [key: string]: any;
}

interface EquipmentExportServiceProps {
  equipment: Equipment;
}

export function EquipmentExportService({ equipment }: EquipmentExportServiceProps) {
  const exportToCSV = () => {
    const headers = Object.keys(equipment).join(',');
    const values = Object.values(equipment).map(val => 
      typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    ).join(',');
    
    const csvContent = `${headers}\n${values}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${equipment.name}_details.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast.success("Données exportées en CSV");
  };

  const exportToPDF = () => {
    // Simulation d'export PDF - dans un vrai projet, on utiliserait une librairie comme jsPDF
    const content = Object.entries(equipment)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${equipment.name}_details.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast.success("Données exportées en format texte");
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={exportToCSV}>
        <Download className="h-4 w-4 mr-2" />
        CSV
      </Button>
      <Button variant="outline" size="sm" onClick={exportToPDF}>
        <FileText className="h-4 w-4 mr-2" />
        TXT
      </Button>
    </div>
  );
}
