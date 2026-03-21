// ═══════════════════════════════════════════
// API Response types
// ═══════════════════════════════════════════

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  error: string;
  code: ErrorCode;
  details?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// ═══════════════════════════════════════════
// Result type for Server Actions
// ═══════════════════════════════════════════

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: ErrorCode; details?: Record<string, string[]> };

// ═══════════════════════════════════════════
// Error codes
// ═══════════════════════════════════════════

export type ErrorCode =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION"
  | "CONFLICT"
  | "INTERNAL";

// ═══════════════════════════════════════════
// Auth types
// ═══════════════════════════════════════════

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "PROFESSIONAL" | "CLIENT" | "ADMIN";
};

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

// ═══════════════════════════════════════════
// Professional / Search
// ═══════════════════════════════════════════

export type ProfessionalFilters = {
  category?: string | null;
  city?: string | null;
  query?: string | null;
  lat?: number | null;
  lng?: number | null;
  radius?: number; // km, default 50
  page?: number;
  limit?: number;
};
