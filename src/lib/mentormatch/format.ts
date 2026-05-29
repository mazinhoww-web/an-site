// Builds a wa.me link from a stored phone number (keeps digits only).
export function whatsappHref(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export type MmFileTypeValue = 'PDF' | 'VIDEO' | 'ARTICLE' | 'OTHER';

// Maps a filename extension to a library fileType (R16).
export function fileTypeFromName(name: string): MmFileTypeValue {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return 'PDF';
  if (['mp4', 'mov', 'webm', 'mkv'].includes(ext)) return 'VIDEO';
  if (['md', 'txt', 'doc', 'docx'].includes(ext)) return 'ARTICLE';
  return 'OTHER';
}
