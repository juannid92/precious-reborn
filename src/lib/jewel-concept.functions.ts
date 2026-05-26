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

/**
 * BUDGET → vincoli VISIVI concreti per Stability.
 * Termini astratti come "entry-level" vengono ignorati dal modello: servono
 * descrittori fisici (carati pietre, spessore metallo, numero pietre,
 * complessità) per ottenere un'immagine coerente con la fascia di prezzo.
 */
const BUDGET_VISUAL: Record<
  NonNullable<JewelConceptInput["budget"]>,
  { positive: string; negative: string }
> = {
  "up-to-1000": {
    positive:
      "modest scale, delicate and lightweight piece, thin slender metal band or chain (1-2mm), very small accent stones only (0.02-0.10 carat each, melee size), at most 1-3 tiny stones, simple and restrained composition, minimal metalwork, understated entry-level fine jewelry",
    negative:
      "large gemstones, big stones, oversized stones, statement piece, heavy metalwork, thick band, many stones, pave setting, halo setting, cluster, elaborate, ornate, luxury haute joaillerie, multi-carat diamond, huge center stone",
  },
  "1000-2000": {
    positive:
      "small to modest scale, refined lightweight piece, slim metal (1.5-2.5mm), small stones (0.10-0.30 carat each), few stones total (1-5), balanced and elegant but restrained composition",
    negative:
      "large gemstones, oversized center stone, multi-carat, heavy sculptural metalwork, pave cluster, halo, opulent, haute joaillerie",
  },
  "3000-5000": {
    positive:
      "medium scale, well-proportioned piece, medium metal weight (2-3mm), medium stones (0.30-0.80 carat each), selected gemstones with refined setting, moderate complexity",
    negative: "huge multi-carat center stone, extravagant haute joaillerie, oversized statement",
  },
  "5000-plus": {
    positive:
      "generous scale, statement piece, substantial metalwork, prominent center gemstone (1 carat or more) with accent stones, elaborate goldsmith craftsmanship, haute-joaillerie complexity",
    negative: "tiny stones only, plain band, minimal entry-level look",
  },
};

function buildPrompt(input: JewelConceptInput): string {
  const stonesEn = input.stones
    .filter((s) => s !== "nessuna")
    .map((s) => STONE_EN[s as keyof typeof STONE_EN])
    .join(", ");
  const stonePart = stonesEn ? `set with ${stonesEn}` : "no gemstones, pure metalwork";
  const notes = input.notes?.trim();
  const notesPart = notes ? `Client note: "${notes.slice(0, 400)}".` : "";
  const budgetPart = input.budget
    ? `IMPORTANT scale and proportions constraint: ${BUDGET_VISUAL[input.budget].positive}.`
    : "";

  return [
    `Professional jewelry product photography of a single ${TYPE_EN[input.type]},`,
    `${STYLE_EN[input.style]},`,
    `crafted in ${METAL_EN[input.metal]}, ${stonePart}.`,
    budgetPart,
    notesPart,
    "Isolated product shot on a clean neutral white/cream background,",
    "no people, no hands, no human, no model, no body, not worn,",
    "studio lighting, macro shot, ultra-detailed, high detail,",
    "shallow depth of field, fine craftsmanship, luxury jewelry catalog style, 8k.",
  ]
    .filter(Boolean)
    .join(" ");
}

const BASE_NEGATIVE =
  "low quality, blurry, deformed, distorted proportions, ugly, text, watermark, logo, signature, plastic, toy, cartoon, anime, multiple objects, person, hand, body";

function buildNegativePrompt(input: JewelConceptInput): string {
  const extra = input.budget ? BUDGET_VISUAL[input.budget].negative : "";
  return extra ? `${BASE_NEGATIVE}, ${extra}` : BASE_NEGATIVE;
}

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
    form.append("negative_prompt", buildNegativePrompt(data));
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
