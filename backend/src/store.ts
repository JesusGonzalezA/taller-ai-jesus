import * as fs from 'node:fs';
import * as path from 'node:path';
import type { Pena } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function penaPath(id: string): string {
  return path.join(DATA_DIR, `${id}.json`);
}

export function loadPena(id: string): Pena | null {
  ensureDataDir();
  const filePath = penaPath(id);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Pena;
}

export function savePena(pena: Pena): void {
  ensureDataDir();
  fs.writeFileSync(penaPath(pena.id), JSON.stringify(pena, null, 2), 'utf-8');
}

export function listPenas(): Pena[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
    return JSON.parse(raw) as Pena;
  });
}

export function deletePena(id: string): boolean {
  ensureDataDir();
  const filePath = penaPath(id);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}
