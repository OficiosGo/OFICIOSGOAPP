export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 10) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 7)}-${clean.slice(7)}`;
  }
  return phone;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Sanitize an Argentine phone number to international format.
 * Input:  "3534123456" | "543534123456" | "5493534123456" | "+5493534123456"
 * Output: "5493534123456"
 */
export function normalizeArgPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.startsWith("549") && digits.length === 13) return digits;
  if (digits.startsWith("54") && digits.length === 12) return "549" + digits.slice(2);
  if (digits.length === 10) return "549" + digits;

  return digits.startsWith("54") ? digits : "54" + digits;
}