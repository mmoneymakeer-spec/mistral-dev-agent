require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const agentRoutes = require('./routes/agent');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use('/api/agent', agentRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Mistral Dev Agent',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`Mistral Dev Agent API on port ${PORT}`);
});

module.exports = app;
