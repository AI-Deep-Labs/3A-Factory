'use strict';

function yamlQuote(value) {
  return `"${String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function tomlQuote(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function parseCommandFile(content) {
  const normalized = String(content).replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    throw new Error('Command file must start with frontmatter');
  }
  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) throw new Error('Invalid command frontmatter');
  const fmText = normalized.substring(4, endIdx);
  const body = normalized.substring(endIdx + 5).replace(/^\n/, '');

  const meta = {};
  const lines = fmText.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.substring(0, colonIdx).trim();
    let val = line.substring(colonIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (val === 'true') meta[key] = true;
    else if (val === 'false') meta[key] = false;
    else meta[key] = val;
  }

  if (!meta.name) throw new Error('Command missing name');
  if (!meta.description) throw new Error(`Command ${meta.name} missing description`);

  return {
    name: meta.name,
    description: meta.description,
    argumentHint: meta['argument-hint'] || '',
    cursorAlwaysApply: meta.cursorAlwaysApply === true,
    body: body.trimEnd()
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
  if (cmd.body) lines.push(cmd.body, '');
  lines.push('Arguments: $ARGUMENTS', '');
  return lines.join('\n');
}

function emitGeminiCommand(cmd) {
  const body = cmd.body || '';
  const prompt = body ? `${body}\nArguments: {{args}}` : 'Arguments: {{args}}';
  return `description = "${tomlQuote(cmd.description)}"\nprompt = """\n${prompt}\n"""\n`;
}

function emitCursorRule(cmd) {
  const body = cmd.body || '';
  return [
    '---',
    `description: ${yamlQuote(cmd.description)}`,
    'globs: *',
    `alwaysApply: ${cmd.cursorAlwaysApply}`,
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
