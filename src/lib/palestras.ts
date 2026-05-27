import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Palestra } from '@/types/palestra';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'palestras');

export async function getAllPalestras(): Promise<Palestra[]> {
  const files = await readdir(CONTENT_DIR);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  const palestras = await Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await readFile(path.join(CONTENT_DIR, file), 'utf-8');
      return JSON.parse(raw) as Palestra;
    }),
  );

  return palestras;
}

export async function getPalestraBySlug(slug: string): Promise<Palestra | null> {
  try {
    const raw = await readFile(path.join(CONTENT_DIR, `${slug}.json`), 'utf-8');
    return JSON.parse(raw) as Palestra;
  } catch {
    return null;
  }
}

export async function getRelatedPalestras(
  currentSlug: string,
  pilar: string,
): Promise<Palestra[]> {
  const all = await getAllPalestras();
  const samePilar = all.filter((p) => p.pilar === pilar && p.slug !== currentSlug);
  if (samePilar.length > 0) return samePilar.slice(0, 2);
  return all.filter((p) => p.slug !== currentSlug).slice(0, 2);
}
