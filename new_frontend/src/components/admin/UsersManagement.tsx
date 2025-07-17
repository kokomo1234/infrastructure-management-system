import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Edit2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserWithRole = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  created_at: string;
};

const UsersManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          email,
          display_name,
          created_at,
          user_roles (
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive"
        });
        return;
      }

      const formattedUsers: UserWithRole[] = data?.map(user => ({
        id: user.user_id,
        email: user.email || '',
        display_name: user.display_name || user.email || '',
        role: (user.user_roles as any)?.[0]?.role || 'user',
        created_at: user.created_at
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // First, delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: newRole as 'admin' | 'moderator' | 'user'
        });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le rôle",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Rôle mis à jour avec succès"
      });

      fetchUsers(); // Refresh the list
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "moderator": return "bg-yellow-100 text-yellow-800";
      case "user": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrateur";
      case "moderator": return "Modérateur";
      case "user": return "Utilisateur";
      default: return role;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des utilisateurs</CardTitle>
        <CardDescription>
          Gérez les utilisateurs et leurs rôles dans le système.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement des utilisateurs...
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Utilisateur
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Rôle actuel
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <div className="text-sm font-medium">{user.display_name}</div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="text-sm">{user.email}</div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Select
                          value={user.role}
                          onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Utilisateur</SelectItem>
                            <SelectItem value="moderator">Modérateur</SelectItem>
                            <SelectItem value="admin">Administrateur</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun utilisateur trouvé correspondant aux critères de recherche.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManagement;