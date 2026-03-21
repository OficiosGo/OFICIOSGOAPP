export const BRAND_COLORS = {
  yellow: "#F8E40B",
  black: "#121317",
  blue: "#5C80BC",
  olive: "#7A9263",
  gold: "#F5A623",
} as const;

export const MAX_PHOTOS_PER_PROFILE = 10;
export const DEFAULT_PAGE_SIZE = 20;
export const JWT_EXPIRES_IN = "7d";
export const AUTH_COOKIE_NAME = "oficiosgo-token";

export const TIER_ORDER = {
  PREMIUM: 0,
  STANDARD: 1,
  FREE: 2,
} as const;
