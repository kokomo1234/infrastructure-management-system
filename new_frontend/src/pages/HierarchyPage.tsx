
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HierarchyVisualization from '@/components/hierarchy/HierarchyVisualization';
import HierarchyManagement from '@/components/hierarchy/HierarchyManagement';
import TaskAssignment from '@/components/hierarchy/TaskAssignment';
import { useAuth } from '@/context/AuthContext';
import { Network, Users, ClipboardList, Settings } from 'lucide-react';

const HierarchyPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const canSupervise = user?.role === 'admin' || user?.role === 'supervisor';

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">Structure Hiérarchique</h2>
        <p className="text-muted-foreground">
          Visualisez et gérez la hiérarchie organisationnelle et les assignations de tâches
        </p>
      </div>

      <Tabs defaultValue="visualization" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Visualisation
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Tâches
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Gestion
            </TabsTrigger>
          )}
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Équipe
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualization" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Organigramme Interactif</h3>
              <p className="text-sm text-muted-foreground">
                Explorez la structure hiérarchique de votre organisation
              </p>
            </div>
            <HierarchyVisualization />
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <TaskAssignment />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="management" className="space-y-4">
            <HierarchyManagement />
          </TabsContent>
        )}
        
        <TabsContent value="users" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Information sur l'équipe</h3>
              <p className="text-sm text-muted-foreground">
                Consultez les informations détaillées des membres de votre équipe
              </p>
            </div>
            {/* Ici on pourrait ajouter une vue détaillée des utilisateurs */}
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Section en développement - Informations détaillées des utilisateurs</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HierarchyPage;
