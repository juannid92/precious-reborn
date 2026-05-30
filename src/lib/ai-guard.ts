/**
 * Guard leggero per server functions che chiamano provider AI a pagamento.
 *
 * Obiettivo: impedire ad attori esterni di drenare i crediti Fal.ai invocando
 * direttamente gli endpoint RPC (stessi URL del sito) da contesti off-site
 * o senza un browser legittimo.
 *
 * Verifica:
 *  - Header `Origin` (sempre inviato dai browser su POST cross-origin e
 *    same-origin verso endpoint non-GET) appartenente ad un host consentito.
 *  - In subordine, fallback su `Referer`.
 *
 * NON è una difesa anti-abuso completa (per quello servirebbe rate-limit
 * persistente / auth utente), ma blocca la classe più comune di abuso:
 * script automatici che colpiscono direttamente l'endpoint serverFn.
 */
import { getRequestHeader } from "@tanstack/react-start/server";

const ALLOWED_HOSTS = new Set<string>([
  "precious-reborn.lovable.app",
  "id-preview--b4a93947-c1c6-46ef-ae7c-b3407be793ea.lovable.app",
]);

function hostFromUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedHost(host: string | null): boolean {
  if (!host) return false;
  if (ALLOWED_HOSTS.has(host)) return true;
  // Consenti tutti i sandbox/preview Lovable del progetto.
  if (host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com")) {
    return true;
  }
  // Consenti localhost in dev.
  if (host === "localhost" || host.startsWith("localhost:") || host.startsWith("127.0.0.1")) {
    return true;
  }
  return false;
}

export function assertTrustedOrigin(): void {
  const origin = getRequestHeader("origin");
  const referer = getRequestHeader("referer");

  const originHost = hostFromUrl(origin);
  const refererHost = hostFromUrl(referer);

  if (isAllowedHost(originHost) || isAllowedHost(refererHost)) {
    return;
  }

  console.warn("[ai-guard] richiesta rifiutata, origin:", origin, "referer:", referer);
  throw new Error("Richiesta non autorizzata.");
}
