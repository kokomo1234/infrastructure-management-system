
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
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Edit, Trash2, Plus, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

// Types for our component
interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[]; // IDs of permissions
}

// Mock data for permissions
const mockPermissions: Permission[] = [
  { id: "p1", name: "sites.view", description: "Voir les sites" },
  { id: "p2", name: "sites.create", description: "Créer des sites" },
  { id: "p3", name: "sites.update", description: "Modifier des sites" },
  { id: "p4", name: "sites.delete", description: "Supprimer des sites" },
  { id: "p5", name: "users.view", description: "Voir les utilisateurs" },
  { id: "p6", name: "users.create", description: "Créer des utilisateurs" },
  { id: "p7", name: "users.update", description: "Modifier des utilisateurs" },
  { id: "p8", name: "users.delete", description: "Supprimer des utilisateurs" },
  { id: "p9", name: "equipment.view", description: "Voir les équipements" },
  { id: "p10", name: "equipment.create", description: "Créer des équipements" },
  { id: "p11", name: "equipment.update", description: "Modifier des équipements" },
  { id: "p12", name: "equipment.delete", description: "Supprimer des équipements" },
  { id: "p13", name: "maintenance.view", description: "Voir les maintenances" },
  { id: "p14", name: "maintenance.create", description: "Créer des maintenances" },
  { id: "p15", name: "maintenance.update", description: "Modifier des maintenances" },
  { id: "p16", name: "maintenance.delete", description: "Supprimer des maintenances" },
  { id: "p17", name: "logs.view", description: "Voir les journaux d'activité" },
  { id: "p18", name: "admin.access", description: "Accéder à l'administration" },
];

// Mock data for roles
const mockRoles: Role[] = [
  { 
    id: "r1", 
    name: "Admin", 
    description: "Accès complet à toutes les fonctionnalités", 
    userCount: 2, 
    permissions: mockPermissions.map(p => p.id) 
  },
  { 
    id: "r2", 
    name: "Modérateur", 
    description: "Peut gérer le contenu mais pas les utilisateurs", 
    userCount: 3, 
    permissions: ["p1", "p2", "p3", "p4", "p9", "p10", "p11", "p12", "p13", "p14", "p15", "p16"] 
  },
  { 
    id: "r3", 
    name: "Technicien", 
    description: "Peut gérer les équipements et les maintenances", 
    userCount: 5, 
    permissions: ["p1", "p9", "p10", "p11", "p13", "p14", "p15"] 
  },
  { 
    id: "r4", 
    name: "Utilisateur", 
    description: "Accès en lecture seule", 
    userCount: 12, 
    permissions: ["p1", "p9", "p13"] 
  }
];

const RolesManagement = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [isDeleteRoleDialogOpen, setIsDeleteRoleDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState<Omit<Role, "id" | "userCount">>({
    name: "",
    description: "",
    permissions: [],
  });

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle role form changes for name and description
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditRoleDialogOpen && currentRole) {
      setCurrentRole({
        ...currentRole,
        [name]: value,
      });
    } else {
      setNewRole({
        ...newRole,
        [name]: value,
      });
    }
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (isEditRoleDialogOpen && currentRole) {
      setCurrentRole({
        ...currentRole,
        permissions: checked
          ? [...currentRole.permissions, permissionId]
          : currentRole.permissions.filter(id => id !== permissionId),
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: checked
          ? [...newRole.permissions, permissionId]
          : newRole.permissions.filter(id => id !== permissionId),
      });
    }
  };

  // Add new role
  const handleAddRole = () => {
    if (!newRole.name) {
      toast.error("Veuillez saisir un nom pour le rôle.");
      return;
    }

    const newId = `r${roles.length + 1}`;
    const roleToAdd: Role = {
      ...newRole,
      id: newId,
      userCount: 0,
    };

    setRoles([...roles, roleToAdd]);
    setIsAddRoleDialogOpen(false);
    setNewRole({
      name: "",
      description: "",
      permissions: [],
    });
    toast.success("Rôle ajouté avec succès.");
  };

  // Edit role
  const handleEditRole = () => {
    if (!currentRole || !currentRole.name) {
      toast.error("Veuillez saisir un nom pour le rôle.");
      return;
    }

    setRoles(roles.map(role => (role.id === currentRole.id ? currentRole : role)));
    setIsEditRoleDialogOpen(false);
    setCurrentRole(null);
    toast.success("Rôle mis à jour avec succès.");
  };

  // Delete role
  const handleDeleteRole = () => {
    if (!currentRole) return;

    if (currentRole.userCount > 0) {
      toast.error(`Impossible de supprimer ce rôle: ${currentRole.userCount} utilisateurs y sont assignés.`);
      setIsDeleteRoleDialogOpen(false);
      return;
    }

    setRoles(roles.filter(role => role.id !== currentRole.id));
    setIsDeleteRoleDialogOpen(false);
    setCurrentRole(null);
    toast.success("Rôle supprimé avec succès.");
  };

  // Group permissions by category for better organization
  const getPermissionsByCategory = () => {
    const categories = permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
      const category = permission.name.split('.')[0];
      if (!acc[category]) acc[category] = [];
      acc[category].push(permission);
      return acc;
    }, {});
    
    return categories;
  };

  const permissionsByCategory = getPermissionsByCategory();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des rôles</CardTitle>
            <CardDescription>
              Définissez les rôles et les permissions associées
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddRoleDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un rôle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou description..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du rôle</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Utilisateurs</TableHead>
                <TableHead>Nombre de permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.userCount}</TableCell>
                    <TableCell>{role.permissions.length}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentRole(role);
                              setIsEditRoleDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={role.userCount > 0 ? "text-gray-400" : "text-red-500 focus:text-red-500"}
                            disabled={role.userCount > 0}
                            onClick={() => {
                              if (role.userCount === 0) {
                                setCurrentRole(role);
                                setIsDeleteRoleDialogOpen(true);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Aucun rôle trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un rôle</DialogTitle>
            <DialogDescription>
              Créez un nouveau rôle et définissez ses permissions. Cliquez sur enregistrer lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={newRole.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Nom du rôle"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={newRole.description}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Description du rôle"
              />
            </div>
            <div className="mt-6">
              <h4 className="mb-4 font-medium">Permissions</h4>
              <div className="max-h-64 overflow-y-auto pr-2">
                {Object.entries(permissionsByCategory).map(([category, perms]) => (
                  <div key={category} className="mb-4">
                    <h5 className="mb-2 text-sm font-semibold capitalize">{category}</h5>
                    <div className="space-y-2">
                      {perms.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`new-${permission.id}`}
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                          />
                          <Label htmlFor={`new-${permission.id}`} className="cursor-pointer text-sm">
                            {permission.description}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddRole}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le rôle</DialogTitle>
            <DialogDescription>
              Modifiez les détails et les permissions du rôle. Cliquez sur enregistrer lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          {currentRole && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={currentRole.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={currentRole.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="mt-6">
                <h4 className="mb-4 font-medium">Permissions</h4>
                <div className="max-h-64 overflow-y-auto pr-2">
                  {Object.entries(permissionsByCategory).map(([category, perms]) => (
                    <div key={category} className="mb-4">
                      <h5 className="mb-2 text-sm font-semibold capitalize">{category}</h5>
                      <div className="space-y-2">
                        {perms.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-${permission.id}`}
                              checked={currentRole.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                            />
                            <Label htmlFor={`edit-${permission.id}`} className="cursor-pointer text-sm">
                              {permission.description}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditRole}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={isDeleteRoleDialogOpen} onOpenChange={setIsDeleteRoleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {currentRole && (
            <div className="py-4">
              <p className="text-center text-sm">
                <strong>Nom:</strong> {currentRole.name}
                <br />
                <strong>Description:</strong> {currentRole.description}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteRoleDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RolesManagement;
