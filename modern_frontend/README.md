# Système de Gestion d'Infrastructure - Frontend Moderne

Interface utilisateur moderne pour le système de gestion d'infrastructure, construite avec React TypeScript, Vite, ShadCN UI et TailwindCSS.

## 🚀 Fonctionnalités

- **Interface moderne** : Design épuré avec ShadCN UI et TailwindCSS
- **Localisation française** : Toute l'interface en français
- **Gestion des sites** : Vue d'ensemble et détails des sites TDL/TSF
- **Équipements AC compacts** : Affichage minimal (nom, type, capacité)
- **Ordres de travail** : Gestion des maintenances et réparations
- **Tableau de bord** : Métriques et alertes en temps réel
- **Authentification** : Système de connexion sécurisé
- **Thèmes** : Support des thèmes clair/sombre
- **Responsive** : Compatible mobile et desktop

## 🛠️ Technologies

- **React 18** avec TypeScript
- **Vite** pour le build et développement
- **ShadCN UI** pour les composants
- **TailwindCSS** pour le styling
- **React Query** pour la gestion des données
- **React Router** pour la navigation
- **Axios** pour les appels API
- **Lucide React** pour les icônes

## 📦 Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Modifier `.env` avec vos paramètres :
   ```env
   VITE_API_URL=https://infrastructure-management-system-production.up.railway.app/api
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Construire pour la production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Variables d'environnement

- `VITE_API_URL` : URL de l'API backend
- `VITE_APP_NAME` : Nom de l'application
- `VITE_APP_VERSION` : Version de l'application

### Proxy de développement

Le serveur de développement Vite est configuré pour proxifier les appels `/api` vers votre backend Railway.

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants ShadCN UI
│   ├── layout/         # Layout et navigation
│   ├── auth/           # Composants d'authentification
│   └── theme/          # Gestion des thèmes
├── pages/              # Pages de l'application
├── context/            # Contextes React
├── lib/                # Utilitaires et services
│   ├── api.ts          # Service API
│   └── utils.ts        # Fonctions utilitaires
├── App.tsx             # Composant principal
└── main.tsx            # Point d'entrée
```

## 📱 Pages disponibles

- **`/dashboard`** : Tableau de bord avec métriques
- **`/sites`** : Gestion des sites TDL/TSF
- **`/equipment`** : Gestion des équipements AC/UPS/OND
- **`/work-orders`** : Ordres de travail et maintenance
- **`/maintenance`** : Planification des maintenances
- **`/administration`** : Administration système
- **`/settings`** : Paramètres utilisateur

## 🔌 Intégration Backend

Le frontend se connecte à votre backend Express.js existant via l'API REST :

- **Sites TDL** : `GET /api/tdl`
- **Équipements AC** : `GET /api/ac`
- **Systèmes DC** : `GET /api/dc`
- **Ordres de travail** : `GET /api/work-orders` (à implémenter)
- **Utilisateurs** : `GET /api/users` (à implémenter)

## 🎨 Personnalisation

### Thèmes
- Thème clair/sombre automatique
- Variables CSS personnalisables
- Support du mode système

### Couleurs
Les couleurs sont définies dans `src/index.css` avec les variables CSS :
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... */
}
```

## 🔒 Authentification

Système d'authentification simulé pour la démonstration :
- Connexion avec n'importe quel email/mot de passe
- Gestion des sessions avec localStorage
- Protection des routes privées

## 📊 Gestion des données

- **React Query** pour le cache et synchronisation
- **Axios** avec intercepteurs pour l'authentification
- **Gestion d'erreur** automatique avec redirection

## 🌐 Localisation

Toute l'interface est en français :
- Labels et textes d'interface
- Messages d'erreur
- Formats de date/heure
- Notifications

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Serveur statique
```bash
npm run preview
```

### Déploiement
Le dossier `dist/` contient les fichiers statiques prêts pour le déploiement sur :
- Netlify
- Vercel
- GitHub Pages
- Serveur web statique

## 🔧 Développement

### Scripts disponibles
- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualisation du build
- `npm run lint` : Vérification du code

### Ajout de composants ShadCN
```bash
npx shadcn-ui@latest add [component-name]
```

## 📝 Notes importantes

1. **Équipements AC compacts** : Respecte la règle d'affichage minimal (nom, type, capacité)
2. **Compatibilité backend** : Fonctionne avec le schéma de base de données migré
3. **Pas de Supabase** : Utilise uniquement votre backend Express.js/MySQL
4. **Optimisé** : Code optimisé et sans bugs potentiels
5. **Français** : Interface entièrement en français

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez que le backend est accessible
2. Vérifiez les variables d'environnement
3. Consultez la console du navigateur pour les erreurs
4. Vérifiez les logs du serveur de développement

## 📄 Licence

Projet privé - Tous droits réservés
