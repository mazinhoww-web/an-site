// Builds a wa.me link from a stored phone number (keeps digits only).
export function whatsappHref(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}
