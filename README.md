# Jungle Gather Game

Bienvenue dans l'application Jungle Gather Game, une application de jeu interactif qui permet aux nouveaux employés de Welcome to the Jungle de découvrir l'entreprise et ses collaborateurs.

## Fonctionnalités principales

- **Carte interactive** : Une carte de l'entreprise avec les postes et les équipes
- **Questionnaire d'onboarding** : Un questionnaire personnalisé pour les nouveaux employés
- **Chatbot AI** : Un chatbot intégré avec l'assistant Dust pour répondre aux questions des employés
- **Système de points** : Un système de points pour suivre la progression dans le jeu
- **Interface utilisateur moderne** : Une interface responsive et intuitive avec shadcn-ui et Tailwind CSS

## Technologies utilisées

- **Frontend**
  - React 18
  - TypeScript
  - Vite
  - shadcn-ui
  - Tailwind CSS
  - Framer Motion

- **Backend**
  - Node.js
  - Express
  - Proxy local pour gérer les appels API

## Installation

1. **Prérequis**
   - Node.js 18+
   - npm ou yarn

2. **Cloner le projet**
   ```bash
   git clone https://github.com/noahsgds/WelcomeToTheJungle.git
   cd WelcomeToTheJungle
   ```

3. **Installer les dépendances**
   ```bash
   npm install
   ```

4. **Configuration**
   - Créer un fichier `.env` à la racine du projet avec les variables suivantes :
     ```
     VITE_DUST_API_KEY=your_dust_api_key
     VITE_DUST_WID=your_workspace_id
     VITE_DUST_AGENT_ID=your_agent_id
     ```

5. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

## Structure du projet

```
src/
├── components/
│   ├── chatbot/        # Composants du chatbot Dust
│   ├── game/           # Composants du jeu
│   ├── onboarding/     # Composants d'onboarding
│   └── shared/         # Composants réutilisables
├── context/           # Contextes React
├── pages/            # Pages principales
└── proxy.cjs         # Proxy pour les appels API
```

## Fonctionnalités du chatbot Dust

- Intégration avec l'API Dust
- Interface de chat flottante
- Gestion des conversations en temps réel
- Récupération des réponses via un proxy local
- Support des mentions d'agents

## Contribuer

1. Clonez le projet
2. Créez une branche pour votre fonctionnalité
3. Faites vos modifications
4. Commitez vos changements
5. Créez une Pull Request

## Licence

Ce projet est sous licence MIT.
