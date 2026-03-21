import type { ErrorCode } from "@/types";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, string[]>;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode = 400,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  static notFound(entity: string) {
    return new AppError(`${entity} no encontrado`, "NOT_FOUND", 404);
  }

  static unauthorized(msg = "No autorizado") {
    return new AppError(msg, "UNAUTHORIZED", 401);
  }

  static forbidden(msg = "Sin permisos") {
    return new AppError(msg, "FORBIDDEN", 403);
  }

  static validation(details: Record<string, string[]>) {
    return new AppError("Error de validación", "VALIDATION", 422, details);
  }

  static conflict(msg: string) {
    return new AppError(msg, "CONFLICT", 409);
  }

  static internal(msg = "Error interno del servidor") {
    return new AppError(msg, "INTERNAL", 500);
  }
}
