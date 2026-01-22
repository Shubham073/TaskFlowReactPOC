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

function stripComments(code) {
  let out = '';
  const len = code.length;
  let i = 0;
  let state = {
    singleQuote: false,
    doubleQuote: false,
    template: false,
    regex: false,
    blockComment: false,
    lineComment: false,
    escaped: false,
  };

  while (i < len) {
    const ch = code[i];
    const ch2 = code[i + 1];

    // End block comment
    if (state.blockComment) {
      if (ch === '*' && ch2 === '/') {
        state.blockComment = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }

    // End line comment
    if (state.lineComment) {
      if (ch === '\n') {
        state.lineComment = false;
        out += ch; // keep newline
      }
      i++;
      continue;
    }

    // If entering a string or template
    if (!state.singleQuote && !state.doubleQuote && !state.template && !state.regex) {
      // block comment start
      if (ch === '/' && ch2 === '*') {
        state.blockComment = true;
        i += 2;
        continue;
      }
      // line comment start
      if (ch === '/' && ch2 === '/') {
        state.lineComment = true;
        i += 2;
        continue;
      }
      // regex literal start heuristic: if previous non-whitespace char allows regex
      // This is hard to detect perfectly; avoid treating division as regex by a simple heuristic:
      // if previous char is one of ( or , = : ? [ ! & | ; { } \n start, allow regex. Otherwise, don't.
      // We'll check back for a few chars.
      if (ch === '/') {
        // look backwards for previous non-space
        let j = out.length - 1;
        while (j >= 0 && /[\s]/.test(out[j])) j--;
        const prev = j >= 0 ? out[j] : '\n';
        const allowRegex = ['(', ',', '=', ':', '?', '[', '!', '&', '|', ';', '{', '}', '\n'].includes(prev);
        if (allowRegex) {
          state.regex = true;
          out += ch;
          i++;
          continue;
        }
      }
    }

    // Handle string/template/regex states
    if (state.singleQuote) {
      out += ch;
      if (state.escaped) {
        state.escaped = false;
      } else if (ch === '\\') {
        state.escaped = true;
      } else if (ch === "'") {
        state.singleQuote = false;
      }
      i++;
      continue;
    }

    if (state.doubleQuote) {
      out += ch;
      if (state.escaped) {
        state.escaped = false;
      } else if (ch === '\\') {
        state.escaped = true;
      } else if (ch === '"') {
        state.doubleQuote = false;
      }
      i++;
      continue;
    }

    if (state.template) {
      out += ch;
      if (state.escaped) {
        state.escaped = false;
      } else if (ch === '\\') {
        state.escaped = true;
      } else if (ch === '`') {
        state.template = false;
      }
      i++;
      continue;
    }

    if (state.regex) {
      out += ch;
      if (state.escaped) {
        state.escaped = false;
      } else if (ch === '\\') {
        state.escaped = true;
      } else if (ch === '/') {
        state.regex = false;
      }
      i++;
      continue;
    }

    // Not in any special state
    if (ch === "'") {
      state.singleQuote = true;
      out += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      state.doubleQuote = true;
      out += ch;
      i++;
      continue;
    }
    if (ch === '`') {
      state.template = true;
      out += ch;
      i++;
      continue;
    }

    // Default: copy char
    out += ch;
    i++;
  }

  // remove excessive blank lines
  out = out.replace(/\n{3,}/g, '\n\n');
  return out;
}

const root = path.resolve(__dirname, '..', 'src');
const files = findFiles(root, '.tsx');
console.log('Found', files.length, '.tsx files');

for (const file of files) {
  try {
    const original = fs.readFileSync(file, 'utf8');
    const cleaned = stripComments(original);
    if (cleaned !== original) {
      fs.writeFileSync(file, cleaned, 'utf8');
      console.log('Updated:', file);
    }
  } catch (err) {
    console.error('Error processing', file, err);
  }
}

console.log('Done strict pass.');
