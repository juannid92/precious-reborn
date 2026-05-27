/**
 * Server functions — generazione bozza 3D del gioiello via Fal.ai Trellis 2.
 *
 * Trellis 2 impiega 30–90s: una singola call sincrona supera il timeout
 * del worker. Esponiamo quindi due server function:
 *   - submitTrellis3DJob: carica l'immagine concept su fal storage e
 *     sottomette il job → ritorna requestId.
 *   - pollTrellis3DJob: controlla lo stato e, se completato, ritorna l'URL del GLB.
 *
 * SICUREZZA: FAL_KEY letta SOLO dentro .handler().
 */
import { createServerFn } from "@tanstack/react-start";
import { fal } from "@fal-ai/client";
import { z } from "zod";

const ENDPOINT = "fal-ai/trellis-2";

// ─── Schemas ────────────────────────────────────────────────────
const SubmitInputSchema = z.object({
  trellisImageUrl: z
    .string()
    .url()
    .max(2048)
    .regex(/^https?:\/\//i, "URL immagine non pubblico."),
});

const PollInputSchema = z.object({
  requestId: z.string().min(1).max(256),
});

export type SubmitTrellis3DResult = { requestId: string };

export type PollTrellis3DResult =
  | { status: "IN_QUEUE" | "IN_PROGRESS" }
  | { status: "COMPLETED"; glbUrl: string; contentType: string; sizeBytes: number }
  | { status: "FAILED"; error: string };

// ─── Helpers ────────────────────────────────────────────────────
function dataUrlToBlob(dataUrl: string): { blob: Blob; ext: string } {
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
  return { blob: new Blob([bytes], { type: mime }), ext };
}

function ensureKey(): string {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error(
      "Servizio 3D temporaneamente non disponibile. La chiave Fal.ai non è configurata.",
    );
  }
  return apiKey;
}

// ─── 1) Submit ──────────────────────────────────────────────────
export const submitTrellis3DJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SubmitInputSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitTrellis3DResult> => {
    fal.config({ credentials: ensureKey() });

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

    if (!/^https?:\/\//i.test(imageUrl)) {
      console.error("[jewel-3d] fal.storage returned non-HTTP URL:", imageUrl);
      throw new Error("URL immagine non pubblico restituito da Fal storage.");
    }

    try {
      const submitted = await fal.queue.submit(ENDPOINT, {
        input: { image_url: imageUrl },
      });
      return { requestId: submitted.request_id };
    } catch (error) {
      console.error("Fal.ai submit error details:", JSON.stringify(error, null, 2));
      throw new Error(`Fal.ai trellis-2 submit failed: ${JSON.stringify(error)}`);
    }
  });

// ─── 2) Poll ────────────────────────────────────────────────────
export const pollTrellis3DJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PollInputSchema.parse(input))
  .handler(async ({ data }): Promise<PollTrellis3DResult> => {
    fal.config({ credentials: ensureKey() });

    let status: { status: string };
    try {
      status = (await fal.queue.status(ENDPOINT, {
        requestId: data.requestId,
        logs: true,
      })) as { status: string };
    } catch (error) {
      console.error("Fal.ai status error details:", JSON.stringify(error, null, 2));
      return { status: "FAILED", error: "Errore nel controllo dello stato 3D." };
    }

    if (status.status === "COMPLETED") {
      let result: {
        data?: {
          model_glb?: { url?: string; content_type?: string; file_size?: number };
        };
      };
      try {
        result = (await fal.queue.result(ENDPOINT, {
          requestId: data.requestId,
        })) as typeof result;
      } catch (error) {
        console.error("Fal.ai result error details:", JSON.stringify(error, null, 2));
        return { status: "FAILED", error: "Errore nel recupero del risultato 3D." };
      }
      const modelGlb = result?.data?.model_glb;
      const url = modelGlb?.url;
      if (!url) {
        console.error("[jewel-3d] missing model_glb.url:", JSON.stringify(result, null, 2));
        return { status: "FAILED", error: "Risposta 3D senza URL del modello GLB." };
      }
      return {
        status: "COMPLETED",
        glbUrl: url,
        contentType: modelGlb?.content_type || "model/gltf-binary",
        sizeBytes: modelGlb?.file_size ?? 0,
      };
    }

    if (status.status === "FAILED") {
      console.error("[jewel-3d] Trellis job FAILED:", JSON.stringify(status, null, 2));
      return { status: "FAILED", error: "Generazione 3D fallita." };
    }

    // IN_QUEUE | IN_PROGRESS (e qualsiasi altro stato intermedio)
    return {
      status: status.status === "IN_PROGRESS" ? "IN_PROGRESS" : "IN_QUEUE",
    };
  });
