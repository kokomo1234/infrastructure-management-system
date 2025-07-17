
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Edit3, Trash2, Link, Eye } from "lucide-react";
import { ProjectDocument } from "@/types/project";

// Mock documents data
const mockDocuments: ProjectDocument[] = [
  {
    id: "1",
    projectId: "1",
    title: "Plan de maintenance UPS",
    content: "# Plan de maintenance\n\n## Objectifs\n- Vérifier l'état des équipements\n- Identifier les points de défaillance\n- Planifier les remplacements\n\n## Procédures\n1. Inspection visuelle\n2. Tests électriques\n3. Vérification des batteries",
    createdBy: "user1",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-02-10T14:30:00Z",
    linkedTasks: ["1", "2"]
  },
  {
    id: "2",
    projectId: "1",
    title: "Rapport d'inspection",
    content: "# Rapport d'inspection du 14/02/2024\n\n## Équipements vérifiés\n- UPS principal : OK\n- Batteries : 2 défectueuses\n- Système de refroidissement : OK\n\n## Actions recommandées\n- Remplacer les batteries défectueuses\n- Nettoyer les filtres",
    createdBy: "user2",
    createdAt: "2024-02-14T16:00:00Z",
    updatedAt: "2024-02-14T16:00:00Z",
    linkedTasks: ["1"]
  }
];

interface ProjectDocumentsProps {
  projectId: string;
}

export function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
  const [documents, setDocuments] = useState(mockDocuments.filter(doc => doc.projectId === projectId));
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ProjectDocument | null>(null);
  const [viewingDoc, setViewingDoc] = useState<ProjectDocument | null>(null);
  const [newDoc, setNewDoc] = useState({
    title: "",
    content: ""
  });

  const createDocument = () => {
    if (!newDoc.title.trim()) return;

    const document: ProjectDocument = {
      id: Date.now().toString(),
      projectId,
      title: newDoc.title,
      content: newDoc.content,
      createdBy: "user1", // Current user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedTasks: []
    };

    setDocuments(prev => [document, ...prev]);
    setCreateDialogOpen(false);
    setNewDoc({ title: "", content: "" });
  };

  const updateDocument = () => {
    if (!editingDoc || !newDoc.title.trim()) return;

    setDocuments(prev =>
      prev.map(doc =>
        doc.id === editingDoc.id
          ? { ...doc, title: newDoc.title, content: newDoc.content, updatedAt: new Date().toISOString() }
          : doc
      )
    );
    setEditingDoc(null);
    setNewDoc({ title: "", content: "" });
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const startEdit = (doc: ProjectDocument) => {
    setEditingDoc(doc);
    setNewDoc({ title: doc.title, content: doc.content });
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering (vous pourriez utiliser une vraie librairie comme react-markdown)
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentation du projet
            </CardTitle>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau document
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Créer un document</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du document</Label>
                    <Input
                      id="title"
                      value={newDoc.title}
                      onChange={(e) => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Plan de projet, Rapport d'avancement..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Contenu (Markdown supporté)</Label>
                    <Textarea
                      id="content"
                      value={newDoc.content}
                      onChange={(e) => setNewDoc(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="# Titre principal&#10;&#10;## Sous-titre&#10;&#10;- Point 1&#10;- Point 2&#10;&#10;Votre contenu ici..."
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={createDocument} disabled={!newDoc.title.trim()}>
                      Créer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map(doc => (
              <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium line-clamp-2">{doc.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Par User {doc.createdBy}</span>
                        <span>•</span>
                        <span>{new Date(doc.updatedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingDoc(doc);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(doc);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground line-clamp-3">
                    {doc.content.replace(/[#*\-]/g, '').substring(0, 100)}...
                  </div>
                  
                  {doc.linkedTasks && doc.linkedTasks.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Link className="h-3 w-3" />
                      <Badge variant="outline" className="text-xs">
                        {doc.linkedTasks.length} tâche{doc.linkedTasks.length > 1 ? 's' : ''} liée{doc.linkedTasks.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {documents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun document</p>
              <p className="text-sm">Créez votre premier document pour documenter ce projet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{viewingDoc?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[60vh] prose prose-sm max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: viewingDoc ? renderMarkdown(viewingDoc.content) : '' 
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Edit Dialog */}
      <Dialog open={!!editingDoc} onOpenChange={() => setEditingDoc(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Modifier le document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titre du document</Label>
              <Input
                id="edit-title"
                value={newDoc.title}
                onChange={(e) => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Contenu</Label>
              <Textarea
                id="edit-content"
                value={newDoc.content}
                onChange={(e) => setNewDoc(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingDoc(null)}>
                Annuler
              </Button>
              <Button onClick={updateDocument} disabled={!newDoc.title.trim()}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
