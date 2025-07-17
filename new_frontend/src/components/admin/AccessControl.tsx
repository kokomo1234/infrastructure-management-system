
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface AccessRule {
  roleId: string;
  resourceId: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// Mock data for resources
const mockResources: Resource[] = [
  { id: "res1", name: "Sites", category: "Infrastructure", description: "Gestion des sites" },
  { id: "res2", name: "Équipements", category: "Infrastructure", description: "Gestion des équipements" },
  { id: "res3", name: "Maintenance", category: "Opérations", description: "Planification de maintenance" },
  { id: "res4", name: "TDL", category: "Infrastructure", description: "Gestion des tableaux de distribution" },
  { id: "res5", name: "Utilisateurs", category: "Administration", description: "Gestion des utilisateurs" },
  { id: "res6", name: "Rôles", category: "Administration", description: "Gestion des rôles" },
  { id: "res7", name: "Journaux", category: "Surveillance", description: "Journaux d'activité" },
];

// Mock data for roles
const mockRoles = [
  { id: "r1", name: "Admin" },
  { id: "r2", name: "Modérateur" },
  { id: "r3", name: "Technicien" },
  { id: "r4", name: "Utilisateur" },
];

// Mock data for access rules
const generateMockAccessRules = (): AccessRule[] => {
  const rules: AccessRule[] = [];
  
  // Admin has full access to everything
  mockResources.forEach(resource => {
    rules.push({
      roleId: "r1",
      resourceId: resource.id,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true
    });
  });
  
  // Moderator has full access to most resources, except admin resources
  mockResources.forEach(resource => {
    if (resource.category !== "Administration") {
      rules.push({
        roleId: "r2",
        resourceId: resource.id,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: resource.category !== "Infrastructure"
      });
    } else {
      rules.push({
        roleId: "r2",
        resourceId: resource.id,
        canView: true,
        canCreate: false,
        canEdit: false,
        canDelete: false
      });
    }
  });
  
  // Technician has limited access
  mockResources.forEach(resource => {
    rules.push({
      roleId: "r3",
      resourceId: resource.id,
      canView: true,
      canCreate: ["Infrastructure", "Opérations"].includes(resource.category),
      canEdit: ["Infrastructure", "Opérations"].includes(resource.category),
      canDelete: false
    });
  });
  
  // User has view-only access to most resources
  mockResources.forEach(resource => {
    rules.push({
      roleId: "r4",
      resourceId: resource.id,
      canView: resource.category !== "Administration",
      canCreate: false,
      canEdit: false,
      canDelete: false
    });
  });
  
  return rules;
};

const AccessControl = () => {
  const [resources] = useState<Resource[]>(mockResources);
  const [roles] = useState(mockRoles);
  const [accessRules, setAccessRules] = useState<AccessRule[]>(generateMockAccessRules());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = Array.from(new Set(resources.map(resource => resource.category)));

  // Filter resources based on search term, role, and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get access rule for a specific role and resource
  const getAccessRule = (roleId: string, resourceId: string): AccessRule | undefined => {
    return accessRules.find(rule => rule.roleId === roleId && rule.resourceId === resourceId);
  };

  // Update access permission
  const updateAccess = (roleId: string, resourceId: string, permission: keyof Omit<AccessRule, "roleId" | "resourceId">, value: boolean) => {
    setAccessRules(prevRules => {
      return prevRules.map(rule => {
        if (rule.roleId === roleId && rule.resourceId === resourceId) {
          return { ...rule, [permission]: value };
        }
        return rule;
      });
    });
    
    // Show success toast
    const resource = resources.find(r => r.id === resourceId);
    const role = roles.find(r => r.id === roleId);
    if (resource && role) {
      const action = value ? "accordée" : "révoquée";
      const permissionLabels: Record<string, string> = {
        canView: "consultation",
        canCreate: "création",
        canEdit: "modification",
        canDelete: "suppression"
      };
      toast.success(`Permission de ${permissionLabels[permission]} ${action} pour ${role.name} sur ${resource.name}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrôle d'accès</CardTitle>
        <CardDescription>
          Gérez les permissions d'accès aux ressources pour chaque rôle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une ressource..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Ressource</TableHead>
                <TableHead className="w-[150px]">Catégorie</TableHead>
                {selectedRole === "all" ? (
                  <TableHead className="w-[180px]">Rôle</TableHead>
                ) : null}
                <TableHead className="text-center">Consulter</TableHead>
                <TableHead className="text-center">Créer</TableHead>
                <TableHead className="text-center">Modifier</TableHead>
                <TableHead className="text-center">Supprimer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => {
                  // For "all" roles, we show multiple rows per resource (one for each role)
                  if (selectedRole === "all") {
                    return roles.map((role) => {
                      const accessRule = getAccessRule(role.id, resource.id);
                      return (
                        <TableRow key={`${resource.id}-${role.id}`}>
                          {roles.indexOf(role) === 0 ? (
                            <TableCell className="font-medium" rowSpan={roles.length}>
                              <div>
                                <span>{resource.name}</span>
                                <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                              </div>
                            </TableCell>
                          ) : null}
                          {roles.indexOf(role) === 0 ? (
                            <TableCell rowSpan={roles.length}>{resource.category}</TableCell>
                          ) : null}
                          <TableCell>{role.name}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={accessRule?.canView}
                              onCheckedChange={(checked) => {
                                if (accessRule) {
                                  updateAccess(role.id, resource.id, "canView", !!checked);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={accessRule?.canCreate}
                              onCheckedChange={(checked) => {
                                if (accessRule) {
                                  updateAccess(role.id, resource.id, "canCreate", !!checked);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={accessRule?.canEdit}
                              onCheckedChange={(checked) => {
                                if (accessRule) {
                                  updateAccess(role.id, resource.id, "canEdit", !!checked);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={accessRule?.canDelete}
                              onCheckedChange={(checked) => {
                                if (accessRule) {
                                  updateAccess(role.id, resource.id, "canDelete", !!checked);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    });
                  } else {
                    // For a specific role, we just show one row per resource
                    const accessRule = getAccessRule(selectedRole, resource.id);
                    if (!accessRule) return null;
                    
                    return (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          <div>
                            <span>{resource.name}</span>
                            <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={accessRule.canView}
                            onCheckedChange={(checked) => {
                              updateAccess(selectedRole, resource.id, "canView", !!checked);
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={accessRule.canCreate}
                            onCheckedChange={(checked) => {
                              updateAccess(selectedRole, resource.id, "canCreate", !!checked);
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={accessRule.canEdit}
                            onCheckedChange={(checked) => {
                              updateAccess(selectedRole, resource.id, "canEdit", !!checked);
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={accessRule.canDelete}
                            onCheckedChange={(checked) => {
                              updateAccess(selectedRole, resource.id, "canDelete", !!checked);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  }
                }).flat()
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={selectedRole === "all" ? 7 : 6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Aucune ressource trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={() => {
              toast.success("Permissions d'accès sauvegardées avec succès");
            }}
          >
            Enregistrer les modifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessControl;
