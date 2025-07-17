
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersManagement from "@/components/admin/UsersManagement";
import RolesManagement from "@/components/admin/RolesManagement";
import AccessControl from "@/components/admin/AccessControl";
import UserActivityLogs from "@/components/admin/UserActivityLogs";

const Administration = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Administration</h2>
        <p className="text-muted-foreground">
          Gérez les utilisateurs, les rôles et les accès du système.
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="access">Contrôle d'accès</TabsTrigger>
          <TabsTrigger value="logs">Journaux d'activité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <UsersManagement />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <RolesManagement />
        </TabsContent>
        
        <TabsContent value="access" className="space-y-4">
          <AccessControl />
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <UserActivityLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Administration;
