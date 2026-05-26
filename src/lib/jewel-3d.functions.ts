/**
 * Server function — generazione bozza 3D del gioiello via Stability AI.
 *
 * PROVIDER: SOLO Stability AI. Nessun altro provider 3D.
 *
 * ENDPOINT: POST https://api.stability.ai/v2beta/3d/stable-fast-3d
 *   - Image-to-3D sincrono (no polling), risponde direttamente con un file .glb (model/gltf-binary).
 *   - Input multipart/form-data, campo `image` (immagine sorgente, PNG/JPEG/WEBP, ≤ ~10MB).
 *
 * SICUREZZA:
 *   - STABILITY_API_KEY letta SOLO dentro .handler() (mai bundled lato client).
 *   - Validazione input con Zod, data URL formato + size limit.
 *
 * RISPOSTA: bytes binari .glb → base64 → data:model/gltf-binary;base64,... consumato da <model-viewer>.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Jewel3DInputSchema = z.object({
  /** Data URL (data:image/...;base64,...) dell'immagine concept generata. */
  imageDataUrl: z
    .string()
    .max(12_000_000) // ~9MB base64 ≈ 7MB immagine
    .regex(/^data:image\/(png|jpe?g|webp);base64,/i, "Formato immagine non valido."),
});

export type Jewel3DInput = z.infer<typeof Jewel3DInputSchema>;

export type Jewel3DResult = {
  /** data:model/gltf-binary;base64,... — direttamente assegnabile a <model-viewer src>. */
  modelUrl: string;
  /** Mime reale ritornato da Stability (es. "model/gltf-binary"). */
  contentType: string;
  /** Endpoint Stability effettivamente chiamato. */
  endpoint: string;
  /** Byte size del .glb generato. */
  sizeBytes: number;
};

function dataUrlToBlob(dataUrl: string): { blob: Blob; mime: string } {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Concept image: formato data URL non valido.");
  const mime = match[1];
  const b64 = match[2];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mime }), mime };
}

const ENDPOINT = "https://api.stability.ai/v2beta/3d/stable-fast-3d";

export const generateJewel3D = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Jewel3DInputSchema.parse(input))
  .handler(async ({ data }): Promise<Jewel3DResult> => {
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Servizio 3D temporaneamente non disponibile. La chiave Stability non è configurata.",
      );
    }

    const { blob, mime } = dataUrlToBlob(data.imageDataUrl);
    const ext = mime.includes("jpeg") || mime.includes("jpg") ? "jpg" : mime.includes("webp") ? "webp" : "png";

    const form = new FormData();
    form.append("image", blob, `concept.${ext}`);
    // Parametri opzionali ragionevoli per still life / gioielli
    form.append("texture_resolution", "1024");
    form.append("foreground_ratio", "0.85");
    form.append("remesh", "none");

    

    let res: Response;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "model/gltf-binary",
        },
        body: form,
      });
    } catch (err) {
      console.error(`[jewel-3d] Network error on ${ENDPOINT}:`, err);
      throw new Error(
        `Errore di rete contattando Stability 3D. ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    

    if (!res.ok) {
      const status = res.status;
      const bodyText = await res.text().catch(() => "");
      let upstreamMsg = bodyText.slice(0, 400);
      try {
        const parsed = JSON.parse(bodyText) as {
          name?: string;
          errors?: string[];
          message?: string;
        };
        upstreamMsg =
          parsed?.errors?.join("; ") || parsed?.message || parsed?.name || upstreamMsg;
      } catch {
        /* raw */
      }
      console.error(
        `[jewel-3d] Stability ${status} on ${ENDPOINT}: ${bodyText.slice(0, 800)}`,
      );

      if (status === 401 || status === 403) {
        throw new Error(`Stability API key non valida o non autorizzata (${status}). ${upstreamMsg}`);
      }
      if (status === 402) {
        throw new Error(`Credito Stability esaurito (402). ${upstreamMsg}`);
      }
      if (status === 429) {
        throw new Error("Atelier 3D sovraccarico: troppe richieste su Stability. Riprova tra poco.");
      }
      if (status === 413) {
        throw new Error("Immagine concept troppo grande per Stability 3D (413).");
      }
      throw new Error(`Generazione 3D Stability fallita (${status}). ${upstreamMsg}`);
    }

    const contentType = res.headers.get("content-type") || "model/gltf-binary";
    const buf = await res.arrayBuffer();
    if (!buf.byteLength) {
      console.error(`[jewel-3d] Stability empty body (${ENDPOINT})`);
      throw new Error("Risposta 3D vuota da Stability.");
    }

    const b64 = Buffer.from(buf).toString("base64");
    const modelUrl = `data:${contentType};base64,${b64}`;

    

    return { modelUrl, contentType, endpoint: ENDPOINT, sizeBytes: buf.byteLength };
  });
