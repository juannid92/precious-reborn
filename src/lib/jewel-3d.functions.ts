/**
 * Server function — generazione bozza 3D del gioiello via Fal.ai Trellis 2.
 *
 * PROVIDER: SOLO Fal.ai (modello "fal-ai/trellis-2").
 *
 * FLUSSO:
 *   1. Riceve un'immagine concept come data URL (data:image/...;base64,...).
 *   2. La carica su fal storage → URL pubblico HTTPS.
 *   3. Chiama fal.subscribe("fal-ai/trellis-2") con SOLO image_url.
 *      fal.subscribe gestisce internamente il polling della coda.
 *   4. Ritorna result.data.model_glb.url come `modelUrl` (URL remoto al .glb).
 *
 * SICUREZZA:
 *   - FAL_KEY letta SOLO dentro .handler() (mai bundled lato client).
 */
import { createServerFn } from "@tanstack/react-start";
import { fal } from "@fal-ai/client";
import { z } from "zod";

const Jewel3DInputSchema = z.object({
  imageDataUrl: z
    .string()
    .max(12_000_000)
    .regex(/^data:image\/(png|jpe?g|webp);base64,/i, "Formato immagine non valido."),
});

export type Jewel3DInput = z.infer<typeof Jewel3DInputSchema>;

export type Jewel3DResult = {
  modelUrl: string;
  contentType: string;
  endpoint: string;
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

    // 1) Carica concept su fal storage → URL pubblico HTTPS
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
      console.error("[jewel-3d] fal.storage.upload returned non-HTTP URL:", imageUrl);
      throw new Error("URL immagine non pubblico restituito da Fal storage.");
    }

    // 2) fal.subscribe: gestisce polling internamente (30–90s tipici)
    let result: { data?: { model_glb?: { url?: string; content_type?: string; file_size?: number } } };
    try {
      result = (await fal.subscribe(ENDPOINT, {
        input: {
          image_url: imageUrl,
        },
        logs: true,
      })) as typeof result;
    } catch (error) {
      console.error("Fal.ai error details:", JSON.stringify(error, null, 2));
      throw new Error(`Fal.ai trellis-2 failed: ${JSON.stringify(error)}`);
    }

    const modelGlb = result?.data?.model_glb;
    const modelUrl = modelGlb?.url;
    if (!modelUrl) {
      console.error("[jewel-3d] missing model_glb.url in fal result:", JSON.stringify(result, null, 2));
      throw new Error("Risposta 3D Fal.ai senza URL del modello GLB.");
    }

    return {
      modelUrl,
      contentType: modelGlb?.content_type || "model/gltf-binary",
      endpoint: ENDPOINT,
      sizeBytes: modelGlb?.file_size ?? 0,
    };
  });
