const express = require('express');
const router = express.Router();
const { runAgentTask, debugCode, explainCode } = require('../services/mistral');
const { writeFile, readFile, listFiles, clearWorkspace, parseFilesFromResponse } = require('../tools/fileSystem');
const { addLog, addToHistory, getHistory, getLogs, clearMemory } = require('../memory/store');

router.post('/task', async (req, res) => {
  const { task, mode = 'code', apiKey, code, error } = req.body;

  if (!task) return res.status(400).json({ error: 'Tâche requise' });

  addLog('TASK', `Nouvelle tâche: ${task.substring(0, 80)}`);
  addLog('PLAN', 'Analyse de la tâche en cours...');

  try {
    const history = getHistory();
    let response;

    if (mode === 'debug') {
      addLog('DEBUG', 'Mode débogage activé');
      response = await debugCode(code, error, apiKey);
    } else if (mode === 'explain') {
      addLog('EXPLAIN', 'Mode explication activé');
      response = await explainCode(code, apiKey);
    } else {
      response = await runAgentTask(task, history, apiKey);
    }

    const files = parseFilesFromResponse(response);
    const savedFiles = [];

    for (const file of files) {
      writeFile(file.name, file.content);
      savedFiles.push({ name: file.name, size: file.content.length });
      addLog('ACT', `Fichier créé: ${file.name} (${file.content.length} chars)`);
    }

    addToHistory('user', task);
    addToHistory('assistant', response);

    if (files.length > 0) {
      addLog('DONE', `${files.length} fichier(s) généré(s) avec succès`);
    } else {
      addLog('DONE', 'Réponse générée sans fichiers');
    }

    res.json({
      success: true,
      response,
      files: savedFiles,
      filesCount: files.length
    });

  } catch (err) {
    addLog('ERROR', err.message);
    if (err.response?.status === 401) {
      return res.status(401).json({ error: 'Clé API Mistral invalide' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.get('/files', (req, res) => {
  try {
    const files = listFiles();
    res.json({ success: true, files, count: files.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/files/*', (req, res) => {
  try {
    const filename = req.params[0];
    const content = readFile(filename);
    res.json({ success: true, filename, content });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.get('/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json({ success: true, logs: getLogs(limit) });
});

router.delete('/workspace', (req, res) => {
  clearWorkspace();
  clearMemory();
  addLog('ACT', 'Workspace et mémoire effacés');
  res.json({ success: true, message: 'Workspace effacé' });
});

module.exports = router;
