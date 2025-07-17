
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HierarchyUser } from '@/types/hierarchy';
import { getAllUsers, getSubordinates, getSupervisor } from '@/lib/hierarchyService';
import { Users, Crown, Star, UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'sonner';

const HierarchyManagement = () => {
  const [users, setUsers] = useState<HierarchyUser[]>(getAllUsers());
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newSupervisorId, setNewSupervisorId] = useState<string>('');

  const selectedUser = users.find(u => u.id === selectedUserId);
  const currentSupervisor = selectedUser ? getSupervisor(selectedUser.id) : null;
  const subordinates = selectedUser ? getSubordinates(selectedUser.id) : [];
  
  // Filtrer les utilisateurs qui peuvent être superviseurs (ne pas inclure l'utilisateur lui-même ni ses subordonnés)
  const availableSupervisors = users.filter(user => 
    user.id !== selectedUserId && 
    !subordinates.some(sub => sub.id === user.id) &&
    (user.role === 'admin' || user.role === 'supervisor')
  );

  const handleAssignSupervisor = () => {
    if (!selectedUserId || !newSupervisorId) {
      toast.error('Veuillez sélectionner un utilisateur et un superviseur');
      return;
    }

    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUserId 
          ? { ...user, supervisorId: newSupervisorId }
          : user
      )
    );
    
    setNewSupervisorId('');
    toast.success('Superviseur assigné avec succès');
  };

  const handleRemoveSupervisor = () => {
    if (!selectedUserId) return;

    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUserId 
          ? { ...user, supervisorId: undefined }
          : user
      )
    );
    
    toast.success('Superviseur retiré avec succès');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'supervisor':
        return <Star className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Administrateur</Badge>;
      case 'supervisor':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Superviseur</Badge>;
      default:
        return <Badge variant="outline">Utilisateur</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Relations Hiérarchiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-select">Sélectionner un utilisateur</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un utilisateur..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span>{user.name}</span>
                          <span className="text-gray-500 text-sm">({user.position})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUser && (
                <Card className="p-4 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback>
                        {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-600">{selectedUser.position}</p>
                      <p className="text-sm text-gray-500">{selectedUser.department}</p>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="supervisor-select">Assigner un superviseur</Label>
                <Select value={newSupervisorId} onValueChange={setNewSupervisorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un superviseur..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun superviseur</SelectItem>
                    {availableSupervisors.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span>{user.name}</span>
                          <span className="text-gray-500 text-sm">({user.position})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleAssignSupervisor}
                  disabled={!selectedUserId || !newSupervisorId}
                  className="flex-1"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assigner
                </Button>
                {currentSupervisor && (
                  <Button 
                    variant="outline" 
                    onClick={handleRemoveSupervisor}
                    className="flex-1"
                  >
                    <UserMinus className="mr-2 h-4 w-4" />
                    Retirer
                  </Button>
                )}
              </div>
            </div>
          </div>

          {selectedUser && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Superviseur actuel
                  </h4>
                  {currentSupervisor ? (
                    <Card className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={currentSupervisor.avatar} />
                          <AvatarFallback className="text-xs">
                            {currentSupervisor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{currentSupervisor.name}</p>
                          <p className="text-xs text-gray-600">{currentSupervisor.position}</p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun superviseur assigné</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Subordonnés ({subordinates.length})
                  </h4>
                  {subordinates.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {subordinates.map(subordinate => (
                        <Card key={subordinate.id} className="p-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={subordinate.avatar} />
                              <AvatarFallback className="text-xs">
                                {subordinate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-xs">{subordinate.name}</p>
                              <p className="text-xs text-gray-600">{subordinate.position}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun subordonné</p>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HierarchyManagement;
