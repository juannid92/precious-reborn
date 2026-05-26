/**
 * Server function — generazione bozza 3D del gioiello via Fal.ai Trellis 2.
 *
 * PROVIDER: SOLO Fal.ai (modello "fal-ai/trellis-2"). Stability AI rimosso.
 *
 * FLUSSO:
 *   1. Riceve un'immagine concept come data URL (data:image/...;base64,...).
 *   2. La carica su fal storage per ottenere un image_url pubblico.
 *   3. Sottomette il job in coda (fal.queue.submit) e fa polling
 *      con fal.queue.status finché completed (Trellis 2 richiede 30-90s).
 *   4. Recupera il risultato con fal.queue.result, estrae result.model_glb.url
 *      e lo ritorna come `modelUrl` (URL remoto al .glb).
 *
 * SICUREZZA:
 *   - FAL_KEY letta SOLO dentro .handler() (mai bundled lato client).
 *
 * COMPATIBILITÀ:
 *   - Il return shape è invariato rispetto alla precedente implementazione
 *     Stability: { modelUrl, contentType, endpoint, sizeBytes }. Il viewer
 *     <model-viewer> e il download .glb continuano a funzionare senza modifiche.
 */
import { createServerFn } from "@tanstack/react-start";
import { fal } from "@fal-ai/client";
import { z } from "zod";

const Jewel3DInputSchema = z.object({
  /** Data URL (data:image/...;base64,...) dell'immagine concept generata. */
  imageDataUrl: z
    .string()
    .max(12_000_000)
    .regex(/^data:image\/(png|jpe?g|webp);base64,/i, "Formato immagine non valido."),
});

export type Jewel3DInput = z.infer<typeof Jewel3DInputSchema>;

export type Jewel3DResult = {
  /** URL diretto al .glb su fal storage — assegnabile a <model-viewer src>. */
  modelUrl: string;
  /** Mime del file restituito. */
  contentType: string;
  /** Endpoint Fal effettivamente usato. */
  endpoint: string;
  /** Byte size del .glb generato (0 se non noto). */
  sizeBytes: number;
};

const ENDPOINT = "fal-ai/trellis-2";

function dataUrlToBlob(dataUrl: string): { blob: Blob; mime: string; ext: string } {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Concept image: formato data URL non valido.");
  const mime = match[1];
  const b64 = match[2];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const ext =
    mime.includes("jpeg") || mime.includes("jpg")
      ? "jpg"
      : mime.includes("webp")
        ? "webp"
        : "png";
  return { blob: new Blob([bytes], { type: mime }), mime, ext };
}

export const generateJewel3D = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Jewel3DInputSchema.parse(input))
  .handler(async ({ data }): Promise<Jewel3DResult> => {
    const apiKey = process.env.FAL_KEY;
    if (!apiKey) {
      throw new Error(
        "Servizio 3D temporaneamente non disponibile. La chiave Fal.ai non è configurata.",
      );
    }

    fal.config({ credentials: apiKey });

    // 1) Carica l'immagine concept su fal storage → URL pubblico
    const { blob, ext } = dataUrlToBlob(data.imageDataUrl);
    const file = new File([blob], `concept.${ext}`, { type: blob.type });

    let imageUrl: string;
    try {
      imageUrl = await fal.storage.upload(file);
    } catch (err) {
      console.error("[jewel-3d] fal.storage.upload failed:", err);
      throw new Error(
        `Caricamento immagine su Fal storage fallito. ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    // 2) Submit in coda (Trellis 2 è asincrono, 30-90s)
    let requestId: string;
    try {
      const submitted = await fal.queue.submit(ENDPOINT, {
        input: {
          image_url: imageUrl,
          resolution: 1024,
          decimation_target: 100000,
          texture_size: 2048,
          remesh: true,
        },
      });
      requestId = submitted.request_id;
    } catch (err) {
      console.error(`[jewel-3d] fal.queue.submit failed on ${ENDPOINT}:`, err);
      throw new Error(
        `Sottomissione job 3D fallita su Fal.ai. ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    // 3) Polling status fino a COMPLETED (max ~3 minuti)
    const maxAttempts = 60; // 60 * 3s = 180s
    const intervalMs = 3000;
    let attempt = 0;
    while (true) {
      attempt++;
      if (attempt > maxAttempts) {
        throw new Error("Generazione 3D Fal.ai in timeout (oltre 3 minuti).");
      }
      let status: Awaited<ReturnType<typeof fal.queue.status>>;
      try {
        status = await fal.queue.status(ENDPOINT, {
          requestId,
          logs: false,
        });
      } catch (err) {
        console.error("[jewel-3d] fal.queue.status failed:", err);
        throw new Error(
          `Errore controllando lo stato del job Fal.ai. ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
      if (status.status === "COMPLETED") break;
      if (status.status === "IN_QUEUE" || status.status === "IN_PROGRESS") {
        await new Promise((r) => setTimeout(r, intervalMs));
        continue;
      }
      console.error("[jewel-3d] fal queue unexpected status:", status);
      throw new Error(`Job 3D Fal.ai terminato in stato inatteso: ${String(status.status)}.`);
    }

    // 4) Recupera il risultato
    let resultPayload: {
      data?: {
        model_glb?: { url?: string; content_type?: string; file_size?: number };
      };
    };
    try {
      resultPayload = (await fal.queue.result(ENDPOINT, { requestId })) as typeof resultPayload;
    } catch (err) {
      console.error("[jewel-3d] fal.queue.result failed:", err);
      throw new Error(
        `Recupero risultato 3D Fal.ai fallito. ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    const modelGlb = resultPayload?.data?.model_glb;
    const modelUrl = modelGlb?.url;
    if (!modelUrl) {
      console.error("[jewel-3d] missing model_glb.url in fal result:", resultPayload);
      throw new Error("Risposta 3D Fal.ai senza URL del modello GLB.");
    }

    return {
      modelUrl,
      contentType: modelGlb?.content_type || "model/gltf-binary",
      endpoint: ENDPOINT,
      sizeBytes: modelGlb?.file_size ?? 0,
    };
  });
