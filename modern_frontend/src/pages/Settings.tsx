import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/theme/ThemeProvider';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || '',
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      position: user?.position || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">
          Gérez vos préférences et paramètres du compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profil utilisateur
              </CardTitle>
              <CardDescription>
                Informations personnelles et coordonnées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse e-mail
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Département
                    </label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poste
                    </label>
                    <Input
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleCancel}>
                        Annuler
                      </Button>
                      <Button onClick={handleSave}>
                        Enregistrer
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Thème
                  </label>
                  <div className="flex space-x-3">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                    >
                      Clair
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                    >
                      Sombre
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                    >
                      Système
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Langue
                  </label>
                  <div className="flex items-center space-x-2">
                    <Badge>Français</Badge>
                    <span className="text-sm text-gray-500">
                      (Langue par défaut du système)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription>
                Gérez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Alertes d'équipement</p>
                    <p className="text-sm text-gray-600">Notifications en cas de panne ou maintenance</p>
                  </div>
                  <Badge className="text-green-600 bg-green-100">Activé</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Ordres de travail</p>
                    <p className="text-sm text-gray-600">Notifications pour les nouveaux ordres assignés</p>
                  </div>
                  <Badge className="text-green-600 bg-green-100">Activé</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Rapports hebdomadaires</p>
                    <p className="text-sm text-gray-600">Résumé hebdomadaire des activités</p>
                  </div>
                  <Badge className="text-gray-600 bg-gray-100">Désactivé</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          {/* Account info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <Badge className="text-green-600 bg-green-100">Actif</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rôle</span>
                  <span className="font-medium">Administrateur</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière connexion</span>
                  <span className="font-medium">Aujourd'hui</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Membre depuis</span>
                  <span className="font-medium">Janvier 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Changer le mot de passe
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Authentification à deux facteurs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Sessions actives
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base de données</span>
                  <Badge className="text-green-600 bg-green-100">Connectée</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API</span>
                  <Badge className="text-green-600 bg-green-100">Opérationnelle</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Migration</span>
                  <Badge className="text-green-600 bg-green-100">Terminée</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
