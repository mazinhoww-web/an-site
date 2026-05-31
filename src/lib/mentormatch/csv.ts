// CSV serialization with a UTF-8 BOM (Excel-friendly) and RFC-4180 quoting.
const BOM = '﻿';

function escapeCell(value: unknown): string {
  const s = value == null ? '' : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))];
  return BOM + lines.join('\r\n');
}
