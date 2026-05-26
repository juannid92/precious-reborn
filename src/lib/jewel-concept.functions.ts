/**
 * Server function — generazione concept gioiello via Stability AI v2beta.
 *
 * SICUREZZA:
 * - STABILITY_API_KEY letta SOLO dentro .handler() (mai bundled lato client).
 * - Validazione input con Zod.
 *
 * ENDPOINT:
 * - Text-to-image (no reference)  → /v2beta/stable-image/generate/core
 *   Motivo: rapido, economico, qualità eccellente su still life / gioielli.
 * - Image-to-image (con reference) → /v2beta/stable-image/generate/sd3
 *   Motivo: /core NON supporta image-to-image; sd3 supporta mode=image-to-image
 *   con parametro `strength`, offrendo il controllo richiesto sulla reference.
 *
 * RISPOSTA: accept=image/* → bytes binari → convertiti in data:image/<fmt>;base64
 * per essere consumati direttamente dal ConceptPreviewPanel.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const JewelInputSchema = z.object({
  type: z.enum(["anello", "collana", "bracciale", "orecchini"]),
  style: z.enum(["minimal", "classico", "moderno", "statement", "romantico", "bespoke"]),
  metal: z.enum(["oro-giallo", "oro-bianco", "oro-rosa", "platino"]),
  stones: z
    .array(z.enum(["diamante", "zaffiro", "rubino", "smeraldo", "perla", "nessuna"]))
    .max(6)
    .default([]),
  budget: z.enum(["up-to-1000", "1000-2000", "3000-5000", "5000-plus"]).optional(),
  notes: z.string().max(800).optional().default(""),
  /** Data URL (data:image/...;base64,...) opzionale dell'ispirazione caricata. */
  inspirationDataUrl: z
    .string()
    .max(8_000_000) // ~6MB base64 ≈ 4.5MB immagine
    .regex(/^data:image\/(png|jpe?g|webp);base64,/i)
    .optional(),
});

export type JewelConceptInput = z.infer<typeof JewelInputSchema>;

export type JewelConceptResult = {
  imageUrl: string;
  prompt: string;
  endpoint: string;
  mode: "text-to-image" | "image-to-image";
};

const TYPE_EN: Record<JewelConceptInput["type"], string> = {
  anello: "ring",
  collana: "necklace",
  bracciale: "bracelet",
  orecchini: "earrings",
};

const STYLE_EN: Record<JewelConceptInput["style"], string> = {
  minimal: "minimalist, essential lines, pure geometry",
  classico: "classic, timeless elegance, traditional craftsmanship",
  moderno: "modern, contemporary volumes, bold silhouette",
  statement: "statement piece, sculptural presence, scenic",
  romantico: "romantic, soft curves, intimate heart details",
  bespoke: "fully bespoke, one-of-a-kind couture jewelry",
};

const METAL_EN: Record<JewelConceptInput["metal"], string> = {
  "oro-giallo": "polished 18kt yellow gold",
  "oro-bianco": "polished 18kt white gold",
  "oro-rosa": "polished 18kt rose gold",
  platino: "polished platinum",
};

const STONE_EN: Record<Exclude<JewelConceptInput["stones"][number], "nessuna">, string> = {
  diamante: "brilliant-cut diamonds",
  zaffiro: "deep blue sapphires",
  rubino: "intense red rubies",
  smeraldo: "natural green emeralds",
  perla: "lustrous cultured pearls",
};

const BUDGET_EN: Record<NonNullable<JewelConceptInput["budget"]>, string> = {
  "up-to-1000": "entry-level couture (500€–1000€): refined but essential, smaller stones, lighter metalwork",
  "1000-2000": "mid-range bespoke (1000€–2000€): carefully crafted, modest stones, balanced metalwork",
  "3000-5000": "high-end bespoke (3000€–5000€): more elaborate composition, selected gemstones, richer metalwork",
  "5000-plus": "luxury haute-joaillerie (5000€+): statement piece, premium gemstones, intricate goldsmith craftsmanship",
};

function buildPrompt(input: JewelConceptInput): string {
  const stonesEn = input.stones
    .filter((s) => s !== "nessuna")
    .map((s) => STONE_EN[s as keyof typeof STONE_EN])
    .join(", ");
  const stonePart = stonesEn ? `set with ${stonesEn}` : "no gemstones, pure metalwork";
  const notes = input.notes?.trim();
  const notesPart = notes ? `Client note: "${notes.slice(0, 400)}".` : "";
  const budgetPart = input.budget ? `Target tier: ${BUDGET_EN[input.budget]}.` : "";

  return [
    `Editorial product photograph of a luxury ${TYPE_EN[input.type]},`,
    `${STYLE_EN[input.style]},`,
    `crafted in ${METAL_EN[input.metal]}, ${stonePart}.`,
    budgetPart,
    notesPart,
    "Single hero piece centered on a soft cream linen background,",
    "dramatic studio lighting, soft warm key light from upper right,",
    "subtle golden rim light, macro focus, ultra-detailed jewelry photography,",
    "shallow depth of field, museum-grade craftsmanship, cinematic, 8k, high-end atelier aesthetic.",
  ]
    .filter(Boolean)
    .join(" ");
}

const NEGATIVE_PROMPT =
  "low quality, blurry, deformed, distorted proportions, ugly, text, watermark, logo, signature, plastic, toy, cartoon, anime, multiple objects, person, hand, body";

/** Decodifica un data URL base64 in Blob (runtime Worker-compatibile). */
function dataUrlToBlob(dataUrl: string): { blob: Blob; mime: string } {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Inspiration image: formato data URL non valido.");
  const mime = match[1];
  const b64 = match[2];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mime }), mime };
}

export const generateJewelConcept = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => JewelInputSchema.parse(input))
  .handler(async ({ data }): Promise<JewelConceptResult> => {
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Servizio temporaneamente non disponibile. La chiave Stability non è configurata.",
      );
    }

    const prompt = buildPrompt(data);
    const hasReference = Boolean(data.inspirationDataUrl);
    const mode: "text-to-image" | "image-to-image" = hasReference
      ? "image-to-image"
      : "text-to-image";

    const endpoint = hasReference
      ? "https://api.stability.ai/v2beta/stable-image/generate/sd3"
      : "https://api.stability.ai/v2beta/stable-image/generate/core";

    const form = new FormData();
    form.append("prompt", prompt);
    form.append("negative_prompt", NEGATIVE_PROMPT);
    form.append("output_format", "png");
    form.append("aspect_ratio", "1:1");
    form.append("style_preset", "photographic");

    if (hasReference) {
      const { blob } = dataUrlToBlob(data.inspirationDataUrl!);
      form.append("mode", "image-to-image");
      form.append("model", "sd3.5-large");
      form.append("strength", "0.65"); // bilancia reference vs prompt
      form.append("image", blob, "inspiration.png");
    }

    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "image/*",
        },
        body: form,
      });
    } catch (err) {
      console.error(`[jewel-concept] Stability network error (${endpoint}):`, err);
      throw new Error(
        `Errore di rete contattando Stability (${endpoint}). ${
          err instanceof Error ? err.message : String(err)
        }`,
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
          parsed?.errors?.join("; ") ||
          parsed?.message ||
          parsed?.name ||
          upstreamMsg;
      } catch {
        /* lascia bodyText raw */
      }
      console.error(
        `[jewel-concept] Stability ${status} on ${endpoint} (mode=${mode}): ${bodyText.slice(
          0,
          800,
        )}`,
      );

      if (status === 401 || status === 403) {
        throw new Error(`Stability API key non valida o non autorizzata (${status}). ${upstreamMsg}`);
      }
      if (status === 402) {
        throw new Error(`Credito Stability esaurito (402). ${upstreamMsg}`);
      }
      if (status === 429) {
        throw new Error("Atelier sovraccarico: troppe richieste su Stability. Riprova tra poco.");
      }
      if (status === 413) {
        throw new Error("Immagine di ispirazione troppo grande per Stability (413).");
      }
      throw new Error(`Generazione Stability fallita (${status} su ${endpoint}). ${upstreamMsg}`);
    }

    // Successo: bytes immagine
    const contentType = res.headers.get("content-type") || "image/png";
    const buf = await res.arrayBuffer();
    if (!buf.byteLength) {
      console.error(`[jewel-concept] Stability empty body (${endpoint})`);
      throw new Error("Risposta vuota da Stability.");
    }

    // base64 da ArrayBuffer (Worker-safe via Buffer in nodejs_compat)
    const b64 = Buffer.from(buf).toString("base64");
    const imageUrl = `data:${contentType};base64,${b64}`;

    return { imageUrl, prompt, endpoint, mode };
  });
