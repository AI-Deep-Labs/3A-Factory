'use strict';

function yamlQuote(value) {
  return `"${String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function tomlQuote(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function parseCommandFrontmatter(text) {
  const normalized = String(text).replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    throw new Error('Command file must start with frontmatter');
  }
  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) throw new Error('Invalid command frontmatter');
  const fmText = normalized.substring(4, endIdx);
  const meta = {};
  const lines = fmText.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) {
      i++;
      continue;
    }
    const key = line.substring(0, colonIdx).trim();
    let val = line.substring(colonIdx + 1).trim();
    if (val === '|' || val === '>') {
      const blockLines = [];
      i++;
      while (i < lines.length) {
        const bl = lines[i];
        if (bl.trim() === '' && blockLines.length > 0) {
          const peek = lines[i + 1];
          if (peek === undefined || !/^\s/.test(peek)) break;
        }
        if (/^\s/.test(bl)) blockLines.push(bl.replace(/^\s{2}/, ''));
        else if (bl.trim() === '' && blockLines.length === 0) blockLines.push('');
        else break;
        i++;
      }
      meta[key] = blockLines.join('\n').replace(/\n$/, '');
      continue;
    }
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (val === 'true') meta[key] = true;
    else if (val === 'false') meta[key] = false;
    else meta[key] = val;
    i++;
  }
  return meta;
}

function parseCommandFile(content) {
  const meta = parseCommandFrontmatter(content);
  if (!meta.name) throw new Error('Command missing name');
  if (!meta.description) throw new Error(`Command ${meta.name} missing description`);
  return {
    name: meta.name,
    description: meta.description,
    argumentHint: meta['argument-hint'] || meta.argumentHint || '',
    cursorAlwaysApply: meta.cursorAlwaysApply === true,
    cursorBodyFromSkill: meta.cursorBodyFromSkill !== false,
    cursorPreamble: meta.cursorPreamble || '',
    prompt: meta.prompt || ''
  };
}

function stripSkillFrontmatter(content) {
  const normalized = String(content).replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return normalized.replace(/^\n/, '');
  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) return normalized;
  return normalized.substring(endIdx + 5).replace(/^\n/, '');
}

function emitClaudeCommand(cmd) {
  const lines = ['---', `description: ${yamlQuote(cmd.description)}`, '---', ''];
  if (cmd.prompt.trim()) lines.push(cmd.prompt.trim(), '');
  lines.push('Arguments: $ARGUMENTS', '');
  return lines.join('\n');
}

function emitGeminiCommand(cmd) {
  const body = cmd.prompt.trim();
  const prompt = body ? `${body}\nArguments: {{args}}` : 'Arguments: {{args}}';
  return `description = "${tomlQuote(cmd.description)}"\nprompt = """\n${prompt}\n"""\n`;
}

function emitCursorRule(cmd, skillBody) {
  const alwaysApply = cmd.cursorAlwaysApply;
  let body;
  if (cmd.cursorBodyFromSkill && skillBody !== null) {
    body = `${cmd.cursorPreamble}${cmd.cursorPreamble ? '\n' : ''}${skillBody}`.replace(/^\n/, '');
  } else {
    body = cmd.prompt.trim();
  }
  return [
    '---',
    `description: ${yamlQuote(cmd.description)}`,
    'globs: *',
    `alwaysApply: ${alwaysApply}`,
    '---',
    '',
    body,
    body.endsWith('\n') ? '' : '\n'
  ].join('\n');
}

module.exports = {
  parseCommandFile,
  stripSkillFrontmatter,
  emitClaudeCommand,
  emitGeminiCommand,
  emitCursorRule,
  yamlQuote,
  tomlQuote
};
