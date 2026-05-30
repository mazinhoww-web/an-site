/**
 * Faz parse de um arquivo design.md (Markdown com design tokens) e extrai
 * um objeto de tokens CSS prontos para uso pelo provisioner de tenant.
 *
 * Formato esperado no design.md:
 *   - **Primary Green** `#33820D`
 *   - **Border Gray**   `#CDD3CD`
 *   - Display font: `Exo 2`
 *   - Body font:    `Nunito`
 */
export function parseDesignMd(content: string): Record<string, string> {
  const tokens: Record<string, string> = {};

  // Cores: **Nome** `#hex`
  const colorRegex = /\*\*([^*]+)\*\*\s*`(#[0-9A-Fa-f]{3,8})`/g;
  let match: RegExpExecArray | null;
  while ((match = colorRegex.exec(content)) !== null) {
    const name = match[1];
    const value = match[2];
    if (!name || !value) continue;
    const key = name.trim().toLowerCase().replace(/\s+/g, '-');
    tokens[key] = value;
  }

  // Fontes
  const displayFont = content.match(/Display font[:\s]+`([^`]+)`/);
  const bodyFont = content.match(/Body font[:\s]+`([^`]+)`/);
  if (displayFont?.[1]) tokens['font-display'] = `'${displayFont[1]}', sans-serif`;
  if (bodyFont?.[1]) tokens['font-body'] = `'${bodyFont[1]}', sans-serif`;

  return tokens;
}
