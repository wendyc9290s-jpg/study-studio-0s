import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { previewPdfPath, previewPdfUrl } from './localData';

const execFileAsync = promisify(execFile);

interface PreviewResult {
  lessonId: string;
  pdfPath: string;
  url: string;
  method: 'existing' | 'libreoffice' | 'powerpoint' | 'keynote';
}

const SOFFICE_CANDIDATES = [
  '/Applications/LibreOffice.app/Contents/MacOS/soffice',
  '/opt/homebrew/bin/soffice',
  '/usr/local/bin/soffice',
  'soffice',
];

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function appleScriptString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

async function convertWithLibreOffice(inputPath: string, outputPath: string): Promise<boolean> {
  const outputDir = path.dirname(outputPath);
  const defaultOutput = path.join(outputDir, `${path.basename(inputPath, path.extname(inputPath))}.pdf`);

  for (const soffice of SOFFICE_CANDIDATES) {
    try {
      await execFileAsync(soffice, [
        '--headless',
        '--convert-to',
        'pdf',
        '--outdir',
        outputDir,
        inputPath,
      ], { timeout: 120_000, maxBuffer: 1024 * 1024 });

      if (await fileExists(defaultOutput)) {
        if (defaultOutput !== outputPath) await fs.rename(defaultOutput, outputPath);
        return true;
      }
    } catch {
      // Try the next converter candidate.
    }
  }

  return false;
}

async function convertWithPowerPoint(inputPath: string, outputPath: string): Promise<boolean> {
  if (!(await fileExists('/Applications/Microsoft PowerPoint.app'))) return false;

  const script = `
set inputPath to POSIX file ${appleScriptString(inputPath)}
set outputPath to POSIX file ${appleScriptString(outputPath)}
tell application "Microsoft PowerPoint"
  open inputPath
  delay 1
  save active presentation in outputPath as save as PDF
  close active presentation saving no
end tell
`;

  try {
    await execFileAsync('/usr/bin/osascript', ['-e', script], { timeout: 180_000, maxBuffer: 1024 * 1024 });
    return fileExists(outputPath);
  } catch {
    return false;
  }
}

async function convertWithKeynote(inputPath: string, outputPath: string): Promise<boolean> {
  if (!(await fileExists('/Applications/Keynote.app'))) return false;

  const script = `
set inputPath to POSIX file ${appleScriptString(inputPath)}
set outputPath to POSIX file ${appleScriptString(outputPath)}
tell application "Keynote"
  open inputPath
  delay 1
  export front document to outputPath as PDF
  close front document saving no
end tell
`;

  try {
    await execFileAsync('/usr/bin/osascript', ['-e', script], { timeout: 180_000, maxBuffer: 1024 * 1024 });
    return fileExists(outputPath);
  } catch {
    return false;
  }
}

export async function getPptxPreview(lessonId: string): Promise<PreviewResult | null> {
  const pdfPath = previewPdfPath(lessonId);
  if (!(await fileExists(pdfPath))) return null;
  return {
    lessonId,
    pdfPath,
    url: previewPdfUrl(lessonId),
    method: 'existing',
  };
}

export async function convertPptxPreview(lessonId: string, inputPath: string): Promise<PreviewResult> {
  const existing = await getPptxPreview(lessonId);
  if (existing) return existing;

  const pdfPath = previewPdfPath(lessonId);
  await fs.mkdir(path.dirname(pdfPath), { recursive: true });

  if (await convertWithLibreOffice(inputPath, pdfPath)) {
    return { lessonId, pdfPath, url: previewPdfUrl(lessonId), method: 'libreoffice' };
  }

  if (await convertWithPowerPoint(inputPath, pdfPath)) {
    return { lessonId, pdfPath, url: previewPdfUrl(lessonId), method: 'powerpoint' };
  }

  if (await convertWithKeynote(inputPath, pdfPath)) {
    return { lessonId, pdfPath, url: previewPdfUrl(lessonId), method: 'keynote' };
  }

  throw new Error('No available PPTX converter succeeded. Install LibreOffice or allow Microsoft PowerPoint/Keynote automation.');
}
