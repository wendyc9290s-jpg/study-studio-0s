import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function decodeXml(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function paragraphText(paragraphXml: string): string {
  const textParts = Array.from(paragraphXml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g));
  return textParts.map(match => decodeXml(match[1] ?? '')).join('');
}

export async function importDocxAsHtml(filePath: string): Promise<string> {
  const { stdout } = await execFileAsync('/usr/bin/unzip', ['-p', filePath, 'word/document.xml'], {
    maxBuffer: 20 * 1024 * 1024,
  });

  const paragraphs = Array.from(stdout.matchAll(/<w:p[\s\S]*?<\/w:p>/g))
    .map(match => paragraphText(match[0]).trim())
    .filter(text => text.length > 0);

  if (paragraphs.length === 0) return '';
  return paragraphs.map(text => `<p>${escapeHtml(text)}</p>`).join('');
}
