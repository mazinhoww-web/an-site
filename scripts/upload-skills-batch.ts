import { config } from 'dotenv';
config({ path: '.env.local' });

import { put } from '@vercel/blob';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface SkillMeta {
  slug: string;
  name: string;
  original_file: string;
  asset_format: string;
  asset_size_kb: number;
  blob_url?: string;
  asset_blob_key?: string;
  asset_filename?: string;
  upload_error?: string;
  [key: string]: unknown;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function uploadWithRetry(key: string, buffer: Buffer, retries = 3): Promise<{ url: string; pathname: string }> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await put(key, buffer, {
        access: 'private',
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return { url: result.url, pathname: result.pathname };
    } catch (err: any) {
      if (attempt < retries && (err.message?.includes('rate') || err.status === 429)) {
        console.log(`  Retry ${attempt}/${retries} after 30s...`);
        await sleep(30000);
      } else {
        throw err;
      }
    }
  }
  throw new Error('Unreachable');
}

async function main() {
  const skills: SkillMeta[] = JSON.parse(readFileSync('.planning/skills-metadata.json', 'utf-8'));
  const total = skills.length;
  let success = 0;
  let failed = 0;
  let totalBytes = 0;

  console.log(`Uploading ${total} skills to Vercel Blob...\n`);

  for (let i = 0; i < skills.length; i++) {
    const s = skills[i];
    const filePath = join('Skill', s.original_file);
    const ext = s.asset_format;
    const blobKey = `skills/${s.slug}.${ext}`;
    const assetFilename = `${s.slug}.${ext}`;

    try {
      const buffer = readFileSync(filePath);
      totalBytes += buffer.length;

      const { url, pathname } = await uploadWithRetry(blobKey, buffer);

      s.blob_url = url;
      s.asset_blob_key = pathname;
      s.asset_filename = assetFilename;
      delete s.upload_error;
      success++;

      console.log(`[${i + 1}/${total}] OK: ${s.slug} (${Math.round(buffer.length / 1024)}KB) -> ${url.substring(0, 60)}...`);
    } catch (err: any) {
      s.upload_error = err.message || String(err);
      failed++;
      console.log(`[${i + 1}/${total}] FAIL: ${s.slug} - ${err.message}`);
    }
  }

  writeFileSync('.planning/skills-metadata.json', JSON.stringify(skills, null, 2));

  const log = [
    '# Skills Upload Log - Fase 6',
    '',
    `- Total: ${total}`,
    `- Sucesso: ${success}`,
    `- Falha: ${failed}`,
    `- Tamanho total: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`,
    '',
    '## Primeiras 3 URLs',
    ...skills.filter(s => s.blob_url).slice(0, 3).map(s => `- ${s.slug}: ${s.blob_url}`),
    '',
    ...(failed > 0 ? ['## Falhas', ...skills.filter(s => s.upload_error).map(s => `- ${s.slug}: ${s.upload_error}`)] : ['Nenhuma falha.']),
  ];
  writeFileSync('.planning/skills-upload-log.md', log.join('\n'));

  console.log(`\n--- RESUMO ---`);
  console.log(`Sucesso: ${success}/${total}`);
  console.log(`Falha: ${failed}/${total}`);
  console.log(`Total: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
