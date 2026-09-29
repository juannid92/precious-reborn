const JWKS_URL = "https://rest.fal.ai/.well-known/jwks.json";
const JWKS_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_CLOCK_SKEW_SECONDS = 300;

type FalJwk = { x?: string };
let cachedKeys: FalJwk[] = [];
let cachedAt = 0;

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function hexToBytes(value: string): Uint8Array | null {
  if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) return null;
  return Uint8Array.from(value.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16));
}

async function getFalPublicKeys(): Promise<FalJwk[]> {
  if (cachedKeys.length > 0 && Date.now() - cachedAt < JWKS_MAX_AGE_MS) return cachedKeys;
  const response = await fetch(JWKS_URL, {
    headers: { accept: "application/json" },
    cf: { cacheTtl: 86400, cacheEverything: true },
  } as RequestInit);
  if (!response.ok) throw new Error("fal JWKS unavailable");
  const body = (await response.json()) as { keys?: FalJwk[] };
  cachedKeys = Array.isArray(body.keys) ? body.keys.filter((key) => typeof key.x === "string") : [];
  cachedAt = Date.now();
  return cachedKeys;
}

export async function verifyFalWebhook(request: Request, rawBody: Uint8Array): Promise<boolean> {
  const requestId = request.headers.get("x-fal-webhook-request-id");
  const userId = request.headers.get("x-fal-webhook-user-id");
  const timestamp = request.headers.get("x-fal-webhook-timestamp");
  const signatureHex = request.headers.get("x-fal-webhook-signature");
  if (!requestId || !userId || !timestamp || !signatureHex) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - timestampNumber) > MAX_CLOCK_SKEW_SECONDS) return false;

  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", rawBody));
  const digestHex = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const message = new TextEncoder().encode([requestId, userId, timestamp, digestHex].join("\n"));
  const signature = hexToBytes(signatureHex);
  if (!signature) return false;

  try {
    const keys = await getFalPublicKeys();
    for (const key of keys) {
      if (!key.x) continue;
      try {
        const publicKey = await crypto.subtle.importKey(
          "raw",
          base64UrlToBytes(key.x),
          { name: "Ed25519" },
          false,
          ["verify"],
        );
        if (await crypto.subtle.verify({ name: "Ed25519" }, publicKey, signature, message)) {
          return true;
        }
      } catch {
        // Prova la chiave successiva.
      }
    }
  } catch {
    return false;
  }
  return false;
}
