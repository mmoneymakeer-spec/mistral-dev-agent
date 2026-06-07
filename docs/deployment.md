# Déploiement Mistral Dev Agent

## Local (développement)

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
API disponible sur http://localhost:4000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Interface disponible sur http://localhost:5173

## Railway (production)

1. Aller sur https://railway.app
2. New Project → Deploy from GitHub
3. Sélectionner mistral-dev-agent
4. Ajouter variables:
   - MISTRAL_API_KEY=sk-...
   - NODE_ENV=production
5. Build Command: cd backend && npm install
6. Start Command: cd backend && node src/index.js

## Test API

```bash
curl -X POST https://TON_URL/api/agent/task \
  -H "Content-Type: application/json" \
  -d '{"task":"Crée une API REST todo list en Node.js"}'
```

## Endpoints

- POST /api/agent/task — Envoyer une tâche
- GET /api/agent/files — Lister les fichiers
- GET /api/agent/logs — Voir les logs
- DELETE /api/agent/workspace — Effacer le workspace
