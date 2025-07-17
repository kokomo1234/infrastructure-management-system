
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Send, FileText, Calendar, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface WorkOrderMessageGeneratorProps {
  workOrder: {
    title: string;
    description: string;
    priority: string;
    equipment: Array<{
      id: string;
      name: string;
      type: string;
      model: string;
      location: string;
      brand?: string;
      serialNumber?: string;
    }>;
    contractor?: {
      id: string;
      company: string;
      email: string;
    };
    dueDate?: string;
    estimatedHours?: string;
  };
}

export function WorkOrderMessageGenerator({ workOrder }: WorkOrderMessageGeneratorProps) {
  const [customMessage, setCustomMessage] = useState("");

  const generateAutomaticMessage = () => {
    const equipmentList = workOrder.equipment.map(eq => 
      `• ${eq.name} (${eq.model}) - ${eq.location}${eq.serialNumber ? ` - S/N: ${eq.serialNumber}` : ""}`
    ).join('\n');

    const priorityText = {
      low: "Faible",
      medium: "Moyenne", 
      high: "Élevée",
      urgent: "URGENT"
    }[workOrder.priority] || "Moyenne";

    const dueDateText = workOrder.dueDate 
      ? new Date(workOrder.dueDate).toLocaleDateString("fr-CA", {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : "À déterminer";

    return `Objet: ${workOrder.title} - Priorité ${priorityText}

Bonjour ${workOrder.contractor?.company || '[Nom du fournisseur]'},

Nous avons besoin de votre intervention pour le problème suivant :

📋 DÉTAILS DE L'INTERVENTION
Titre: ${workOrder.title}
Priorité: ${priorityText}
Date d'échéance: ${dueDateText}
${workOrder.estimatedHours ? `Temps estimé: ${workOrder.estimatedHours} heures` : ''}

📝 DESCRIPTION DU PROBLÈME
${workOrder.description}

🔧 ÉQUIPEMENTS CONCERNÉS
${equipmentList}

📅 PROCHAINES ÉTAPES
Merci de nous confirmer :
- Votre disponibilité pour cette intervention
- Une estimation du temps nécessaire
- Si des pièces spécifiques sont requises

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
Équipe de maintenance

---
Référence: WO-${Date.now().toString().slice(-6)}
Date de création: ${new Date().toLocaleDateString("fr-CA")}`;
  };

  const automaticMessage = generateAutomaticMessage();

  const handleCopyMessage = () => {
    const messageToCopy = customMessage || automaticMessage;
    navigator.clipboard.writeText(messageToCopy);
    toast.success("Message copié dans le presse-papiers");
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(workOrder.title);
    const body = encodeURIComponent(customMessage || automaticMessage);
    const email = workOrder.contractor?.email || "";
    
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
    toast.success("Client email ouvert");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé de l'appel de service */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Résumé de l'appel de service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Priorité:</span>
              <Badge className={getPriorityColor(workOrder.priority)}>
                {workOrder.priority === "low" ? "Faible" :
                 workOrder.priority === "medium" ? "Moyenne" :
                 workOrder.priority === "high" ? "Élevée" : "Urgent"}
              </Badge>
            </div>
            {workOrder.dueDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Échéance:</span>
                <span className="text-sm font-medium">
                  {new Date(workOrder.dueDate).toLocaleDateString("fr-CA")}
                </span>
              </div>
            )}
            {workOrder.estimatedHours && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Estimation:</span>
                <span className="text-sm font-medium">{workOrder.estimatedHours}h</span>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Équipements concernés ({workOrder.equipment.length})</h4>
            <div className="space-y-2">
              {workOrder.equipment.map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{equipment.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({equipment.model})</span>
                  </div>
                  <Badge variant="outline">{equipment.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message généré automatiquement */}
      <Card>
        <CardHeader>
          <CardTitle>Message généré automatiquement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {automaticMessage}
            </pre>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyMessage}>
              <Copy className="h-4 w-4 mr-2" />
              Copier le message
            </Button>
            <Button onClick={handleSendEmail}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer par email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message personnalisé */}
      <Card>
        <CardHeader>
          <CardTitle>Personnaliser le message (optionnel)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Modifiez le message ci-dessus ou rédigez votre propre message..."
            rows={8}
          />
          
          {customMessage && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyMessage}>
                <Copy className="h-4 w-4 mr-2" />
                Copier le message personnalisé
              </Button>
              <Button onClick={handleSendEmail}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer par email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
