const fs = require('fs');
const path = require('path');

function findFiles(dir, ext, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findFiles(full, ext, files);
    } else if (entry.isFile() && full.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

function removeComments(content) {
  // 1) Remove block comments that start at line start (to avoid removing /* inside strings)
  content = content.replace(/(^|\n)\s*\/\*[\s\S]*?\*\/\s*(?=\n|$)/g, '\n');

  // 2) Remove single-line comments that occupy the full line or preceded only by whitespace
  content = content.replace(/(^|\n)\s*\/\/.*(?=\n|$)/g, '\n');

  // 3) Trim excessive blank lines (more than 2)
  content = content.replace(/\n{3,}/g, '\n\n');

  return content;
}

const root = path.resolve(__dirname, '..', 'src');
const files = findFiles(root, '.tsx');
console.log('Found', files.length, '.tsx files');

for (const file of files) {
  try {
    const original = fs.readFileSync(file, 'utf8');
    const cleaned = removeComments(original);
    if (cleaned !== original) {
      fs.writeFileSync(file, cleaned, 'utf8');
      console.log('Updated:', file);
    }
  } catch (err) {
    console.error('Error processing', file, err);
  }
}

console.log('Done.');
