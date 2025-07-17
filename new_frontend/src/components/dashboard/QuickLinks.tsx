
import { useState } from "react";
import { PlusCircle, Link, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  isAdmin: boolean;
}

// Mock data - would come from backend in real app
const defaultAdminLinks: QuickLink[] = [
  { id: "1", title: "Documentation UPS", url: "https://example.com/docs", isAdmin: true },
  { id: "2", title: "Manuel de maintenance", url: "https://example.com/manual", isAdmin: true },
];

export function QuickLinks() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  // In a real app, this would be fetched from the backend
  const [links, setLinks] = useState<QuickLink[]>([
    ...defaultAdminLinks,
    { id: "3", title: "Google Drive", url: "https://drive.google.com", isAdmin: false },
  ]);
  
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      const linkToAdd: QuickLink = {
        id: Date.now().toString(),
        title: newLink.title,
        url: newLink.url,
        isAdmin: isAdmin || false,
      };
      
      setLinks([...links, linkToAdd]);
      setNewLink({ title: "", url: "" });
      setIsDialogOpen(false);
    }
  };

  const handleRemoveLink = (id: string) => {
    // Admin can remove any link, users can only remove their own
    const linkToRemove = links.find(link => link.id === id);
    
    if (!linkToRemove) return;
    
    if (isAdmin || !linkToRemove.isAdmin) {
      setLinks(links.filter(link => link.id !== id));
    }
  };

  const userLinks = links.filter(link => !link.isAdmin || isAdmin);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Liens rapides</CardTitle>
            <CardDescription>Accès rapide à vos ressources et outils</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter lien
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un lien rapide</DialogTitle>
                <DialogDescription>
                  Créez un raccourci vers un site web ou une ressource utile.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Titre
                  </Label>
                  <Input
                    id="title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="col-span-3"
                    placeholder="https://"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddLink}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {userLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-3 rounded-lg transition-all hover-scale ${
                link.isAdmin 
                ? "bg-blue-50 border border-blue-100 hover:border-infra-blue" 
                : "bg-gray-50 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${
                  link.isAdmin ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  <Link className={`h-4 w-4 ${
                    link.isAdmin ? "text-infra-blue" : "text-gray-500"
                  }`} />
                </div>
                <span className="ml-3 font-medium">{link.title}</span>
                {link.isAdmin && (
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    Admin
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 text-gray-400 mr-2" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveLink(link.id);
                  }}
                  className="text-gray-400 hover:text-red-500 focus:outline-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
