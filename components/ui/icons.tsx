/**
 * Set de íconos de línea de OficiosGo.
 * Reemplazan a los emoji para una estética más profesional y consistente.
 * Heredan color por `currentColor` y tamaño por prop `size`.
 */
type IconProps = { size?: number; className?: string; strokeWidth?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function BoltIcon({ size = 16, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
    </svg>
  );
}

export function ShieldCheckIcon({ size = 16, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function StarIcon({ size = 16, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <path d="M12 3.5l2.5 5 5.5.8-4 3.9.95 5.5L12 16.9l-4.9 2.6.95-5.5-4-3.9 5.5-.8 2.5-5Z" />
    </svg>
  );
}

export function WrenchIcon({ size = 16, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <path d="M14.5 5.5a3.5 3.5 0 0 0-4.6 4.3L4 15.7 6.3 18l5.9-5.9a3.5 3.5 0 0 0 4.3-4.6l-2 2-1.9-1.9 2-2Z" />
    </svg>
  );
}

export function ClockIcon({ size = 16, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function UsersIcon({ size = 16, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.2a3.2 3.2 0 0 1 0 5.6M20.5 19a5.5 5.5 0 0 0-4-5.3" />
    </svg>
  );
}

export function BadgeCheckIcon({ size = 16, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <path d="m12 2.5 2.1 1.6 2.6-.2.9 2.5 2.1 1.5-.7 2.6.7 2.6-2.1 1.5-.9 2.5-2.6-.2L12 21.5l-2.1-1.6-2.6.2-.9-2.5-2.1-1.5.7-2.6-.7-2.6 2.1-1.5.9-2.5 2.6.2L12 2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
