# 🤖 Mistral Dev Agent

Autonomous AI Software Engineer powered by Mistral API.
Concurrent direct de OpenAI Codex et Claude Code.

## Fonctionnalités
- Génère des applications complètes depuis zéro
- Édition multi-fichiers autonome
- Boucle de débogage automatique
- Mémoire du projet entre les sessions
- Interface Chat + Explorateur de fichiers + Logs

## Stack technique
- Backend: Node.js + Express
- IA: Mistral API (mistral-small-latest)
- Frontend: React + Vite
- Mémoire: JSON file storage

## Démarrage rapide

### Backend
cd backend
cp .env.example .env
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## Variables d'environnement
MISTRAL_API_KEY=sk-...
PORT=4000
NODE_ENV=development

## Endpoints API
- POST /api/agent/task — Envoyer une tâche
- GET /api/agent/files — Lister les fichiers
- GET /api/agent/logs — Voir les logs
- DELETE /api/agent/workspace — Effacer le workspace# mistral-dev-agent
Autonomous AI Software Engineer powered by Mistral
