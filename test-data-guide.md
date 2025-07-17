# Guide pour Ajouter les Données de Test

## 🎯 Objectif
Ajouter 2 équipements AC et 1 besoin AC pour 2027 pour tester l'interface française.

## 📋 Données à Ajouter

### 1. Premier Équipement AC (UPS)
**Navigation**: Équipement → Équipement AC → Ajouter un Nouvel Enregistrement

```
Nom: UPS-DATACENTER-01
Type: UPS
Sortie AC (W): 5000
ID TDL: TDL-PARIS-001
ID TSF: TSF-PARIS-001
ID Paire: 1
Port Switch: GE0/1
Gateway: 192.168.1.1
Netmask: 255.255.255.0
Date d'Installation: 2024
Tension (V): 230
Phase: 3
Puissance Totale (W): 5000
Bypass: Automatique
Commentaires: UPS principal pour datacenter Paris - Test Equipment
ING: 1
Modèle: Galaxy VS
Numéro de Série: SN2024001
ID Fournisseur: 1
ID Fabricant: 1
Adresse IP: 192.168.1.100
Nom d'utilisateur: admin
Mot de passe: secure123
Hors Service: Non (décoché)
SLA: 99
```

### 2. Deuxième Équipement AC (OND)
**Navigation**: Équipement → Équipement AC → Ajouter un Nouvel Enregistrement

```
Nom: OND-BACKUP-02
Type: OND
Sortie AC (W): 3000
ID TDL: TDL-LYON-002
ID TSF: TSF-LYON-002
ID Paire: 2
Port Switch: GE0/2
Gateway: 192.168.2.1
Netmask: 255.255.255.0
Date d'Installation: 2024
Tension (V): 230
Phase: 1
Puissance Totale (W): 3000
Bypass: Manuel
Commentaires: Onduleur de secours Lyon - Test Equipment
ING: 2
Modèle: Smart-UPS RT
Numéro de Série: SN2024002
ID Fournisseur: 2
ID Fabricant: 2
Adresse IP: 192.168.2.100
Nom d'utilisateur: admin
Mot de passe: secure456
Hors Service: Non (décoché)
SLA: 95
```

### 3. Besoin AC pour 2027
**Navigation**: Gestion → Besoins → Ajouter un Nouveau Besoin

```
Type: UPS
ID TDL: TDL-MARSEILLE-003
ID TSF: TSF-MARSEILLE-003
Besoin AC (W): 8000
Besoin DC (W): 0
Besoin Générateur (W): 0
Besoin Climatisation (W): 2000
Année Requise: 2027
Date de Demande: 20250117
Commentaires: Besoin UPS pour nouveau datacenter Marseille - Expansion 2027
RU: 42
```

## 🌐 Comment Procéder

1. **Accédez à votre application web** (URL Netlify)
2. **Utilisez les identifiants de démo**:
   - Nom d'utilisateur: `admin`
   - Mot de passe: `infra2024!`
3. **Naviguez vers chaque section** en utilisant le menu français
4. **Cliquez sur les boutons français**:
   - "Ajouter un Nouvel Enregistrement" pour AC
   - "Ajouter un Nouveau Besoin" pour les besoins
5. **Remplissez les formulaires** avec les données ci-dessus
6. **Cliquez sur "Créer"** pour sauvegarder

## ✅ Résultat Attendu

Après avoir ajouté ces données, vous devriez voir:
- **Dashboard**: Les compteurs mis à jour en français
- **Équipement AC**: 2 nouveaux équipements listés
- **Besoins**: 1 nouveau besoin pour 2027
- **Interface complètement en français** avec tous les labels traduits

## 🎨 Points à Vérifier

- [ ] Navigation en français fonctionne
- [ ] Formulaires affichent les labels français
- [ ] Messages de succès en français
- [ ] Boutons "Modifier" et "Supprimer" en français
- [ ] Modal d'authentification en français
- [ ] Dashboard avec statistiques mises à jour

Cela vous permettra de tester complètement l'interface française avec des données réalistes !
