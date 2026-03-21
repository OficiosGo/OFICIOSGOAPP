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
