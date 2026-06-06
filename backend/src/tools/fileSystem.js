const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.join(__dirname, '../../workspace');

if (!fs.existsSync(WORKSPACE_DIR)) {
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
}

function writeFile(filename, content) {
  const filePath = path.join(WORKSPACE_DIR, filename);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  return { success: true, path: filePath, size: content.length };
}

function readFile(filename) {
  const filePath = path.join(WORKSPACE_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier non trouvé: ${filename}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function listFiles() {
  function walk(dir, base = '') {
    const items = [];
    if (!fs.existsSync(dir)) return items;
    fs.readdirSync(dir).forEach(item => {
      const fullPath = path.join(dir, item);
      const relPath = base ? `${base}/${item}` : item;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        items.push(...walk(fullPath, relPath));
      } else {
        items.push({
          name: relPath,
          size: stat.size,
          modified: stat.mtime.toISOString()
        });
      }
    });
    return items;
  }
  return walk(WORKSPACE_DIR);
}

function deleteFile(filename) {
  const filePath = path.join(WORKSPACE_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return { success: true };
  }
  return { success: false, error: 'Fichier non trouvé' };
}

function clearWorkspace() {
  if (fs.existsSync(WORKSPACE_DIR)) {
    fs.rmSync(WORKSPACE_DIR, { recursive: true, force: true });
    fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
  }
  return { success: true };
}

function parseFilesFromResponse(response) {
  const files = [];
  const regex = /---FILE:\s*(.+?)---\n([\s\S]*?)---END---/g;
  let match;
  while ((match = regex.exec(response)) !== null) {
    files.push({
      name: match[1].trim(),
      content: match[2].trim()
    });
  }
  return files;
}

module.exports = {
  writeFile,
  readFile,
  listFiles,
  deleteFile,
  clearWorkspace,
  parseFilesFromResponse
};
