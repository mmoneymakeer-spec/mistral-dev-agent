const fs = require('fs');
const path = require('path');

const MEMORY_FILE = path.join(__dirname, '../../memory.json');

function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) {
    return { history: [], logs: [], projects: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
  } catch {
    return { history: [], logs: [], projects: [] };
  }
}

function saveMemory(data) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function addLog(type, message) {
  const memory = loadMemory();
  const log = {
    id: Date.now(),
    type,
    message,
    timestamp: new Date().toISOString()
  };
  memory.logs.unshift(log);
  if (memory.logs.length > 200) memory.logs = memory.logs.slice(0, 200);
  saveMemory(memory);
  return log;
}

function addToHistory(role, content) {
  const memory = loadMemory();
  memory.history.push({
    role,
    content,
    timestamp: new Date().toISOString()
  });
  if (memory.history.length > 50) {
    memory.history = memory.history.slice(-50);
  }
  saveMemory(memory);
}

function getHistory() {
  return loadMemory().history.map(h => ({
    role: h.role,
    content: h.content
  }));
}

function getLogs(limit = 50) {
  return loadMemory().logs.slice(0, limit);
}

function clearMemory() {
  saveMemory({ history: [], logs: [], projects: [] });
}

module.exports = {
  addLog,
  addToHistory,
  getHistory,
  getLogs,
  clearMemory
};
