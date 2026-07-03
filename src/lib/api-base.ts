import { Capacitor } from "@capacitor/core";

/**
 * Base origin for backend API routes.
 *
 * In the native Android/iOS shell the web assets are bundled locally (so the
 * app renders offline), which means relative "/api/..." requests would resolve
 * against the local Capacitor origin that has no backend. When running natively
 * we therefore target the live deployment; on the web we keep relative paths so
 * requests hit the same origin (dev server or Vercel).
 */
const NATIVE_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://cracklix.vercel.app";

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (Capacitor.isNativePlatform()) {
    return `${NATIVE_API_BASE}${normalized}`;
  }
  return normalized;
}
