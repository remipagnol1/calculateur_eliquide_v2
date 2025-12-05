# VapeLab - Calculateur E-Liquide

Application React pour le calcul de recettes de cigarette électronique.

## Stack Technique

- **React 18** : Framework UI.
- **TypeScript** : Typage statique pour éviter les erreurs de calcul.
- **Tailwind CSS** : Styling rapide et responsive.
- **Recharts** : Visualisation des données (graphiques).
- **Lucide React** : Icônes.

## Développement Local

1.  Installer les dépendances :
    ```bash
    npm install
    # ou
    yarn
    ```

2.  Lancer le serveur de développement :
    ```bash
    npm run dev
    ```

## Mise en ligne (Déploiement)

Pour mettre cette application en ligne gratuitement et facilement :

### Option 1 : Vercel (Recommandé)
1.  Créez un repository GitHub et poussez ce code.
2.  Allez sur [Vercel.com](https://vercel.com) et connectez votre compte GitHub.
3.  Importez le projet. Vercel détectera automatiquement qu'il s'agit d'une application Vite/React.
4.  Cliquez sur "Deploy".

### Option 2 : Netlify
1.  Même procédure via GitHub.
2.  Ou glissez-déposez le dossier `dist` (généré après `npm run build`) sur l'interface de Netlify Drop.

## Structure du Projet

- `src/utils/calculations.ts` : Contient toute la logique mathématique.
- `src/types.ts` : Définitions des types de données.
- `src/components/` : Composants UI réutilisables.
