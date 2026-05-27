/**
 * Server function — generazione concept gioiello via Together AI.
 *
 * PROVIDER: Together AI — modello `black-forest-labs/FLUX.1-kontext-pro`.
 * Endpoint: POST https://api.together.xyz/v1/images/generations
 *
 * SICUREZZA:
 * - TOGETHER_API_KEY letta SOLO dentro .handler() (mai bundled lato client).
 * - Validazione input con Zod.
 *
 * MODE:
 * - text-to-image: nessuna reference → body senza image_url
 * - image-to-image (kontext): se l'utente carica un'ispirazione → image_url
 *
 * RISPOSTA: response_format=b64_json → base64 → data:image/png;base64,...
 */
import { createServerFn } from "@tanstack/react-start";
import { fal } from "@fal-ai/client";
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
    .max(8_000_000)
    .regex(/^data:image\/(png|jpe?g|webp);base64,/i)
    .optional(),
});

export type JewelConceptInput = z.infer<typeof JewelInputSchema>;

export type JewelConceptResult = {
  imageUrl: string;
  trellisImageUrl: string;
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

const BUDGET_VISUAL: Record<NonNullable<JewelConceptInput["budget"]>, string> = {
  "up-to-1000":
    "modest scale, delicate and lightweight piece, thin slender metal band or chain (1-2mm), very small accent stones only (0.02-0.10 carat each, melee size), at most 1-3 tiny stones, simple and restrained composition, minimal metalwork, understated entry-level fine jewelry",
  "1000-2000":
    "small to modest scale, refined lightweight piece, slim metal (1.5-2.5mm), small stones (0.10-0.30 carat each), few stones total (1-5), balanced and elegant but restrained composition",
  "3000-5000":
    "medium scale, well-proportioned piece, medium metal weight (2-3mm), medium stones (0.30-0.80 carat each), selected gemstones with refined setting, moderate complexity",
  "5000-plus":
    "generous scale, statement piece, substantial metalwork, prominent center gemstone (1 carat or more) with accent stones, elaborate goldsmith craftsmanship, haute-joaillerie complexity",
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
    ? `IMPORTANT scale and proportions constraint: ${BUDGET_VISUAL[input.budget]}.`
    : "";

  const description = [
    `A single ${TYPE_EN[input.type]},`,
    `${STYLE_EN[input.style]},`,
    `crafted in ${METAL_EN[input.metal]}, ${stonePart}.`,
    budgetPart,
    notesPart,
  ]
    .filter(Boolean)
    .join(" ");

  return `${description} professional jewelry product photography, isolated product shot on a clean neutral white or cream background, no people, no hands, no human, no model, no body, not worn, studio lighting, macro shot, luxury jewelry catalog style, ultra-detailed, 8k.`;
}

export const generateJewelConcept = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => JewelInputSchema.parse(input))
  .handler(async ({ data }): Promise<JewelConceptResult> => {
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Servizio temporaneamente non disponibile. La chiave Together AI non è configurata.",
      );
    }

    const prompt = buildPrompt(data);
    const hasReference = Boolean(data.inspirationDataUrl);
    const mode: "text-to-image" | "image-to-image" = hasReference
      ? "image-to-image"
      : "text-to-image";

    const endpoint = "https://api.together.xyz/v1/images/generations";

    const body: Record<string, unknown> = {
      model: "black-forest-labs/FLUX.1-kontext-pro",
      prompt,
      width: 1024,
      height: 1024,
      steps: 28,
      n: 1,
      response_format: "b64_json",
    };

    if (hasReference) {
      // FLUX.1-kontext supporta image_url come riferimento visivo.
      body.image_url = data.inspirationDataUrl;
    }

    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(`[jewel-concept] Together network error:`, err);
      throw new Error(
        `Errore di rete contattando Together AI. ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    const rawText = await res.text();

    if (!res.ok) {
      const status = res.status;
      let upstreamMsg = rawText.slice(0, 400);
      try {
        const parsed = JSON.parse(rawText) as {
          error?: { message?: string; type?: string } | string;
          message?: string;
        };
        if (typeof parsed.error === "object" && parsed.error) {
          upstreamMsg = parsed.error.message || parsed.error.type || upstreamMsg;
        } else if (typeof parsed.error === "string") {
          upstreamMsg = parsed.error;
        } else if (parsed.message) {
          upstreamMsg = parsed.message;
        }
      } catch {
        /* lascia rawText */
      }
      console.error(
        `[jewel-concept] Together ${status} (mode=${mode}): ${rawText.slice(0, 800)}`,
      );

      if (status === 401 || status === 403) {
        throw new Error(`Together API key non valida o non autorizzata (${status}). ${upstreamMsg}`);
      }
      if (status === 402) {
        throw new Error(`Credito Together esaurito (402). ${upstreamMsg}`);
      }
      if (status === 429) {
        throw new Error("Atelier sovraccarico: troppe richieste su Together. Riprova tra poco.");
      }
      if (status === 413) {
        throw new Error("Immagine di ispirazione troppo grande per Together (413).");
      }
      throw new Error(`Generazione Together fallita (${status}). ${upstreamMsg}`);
    }

    let payload: {
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    try {
      payload = JSON.parse(rawText);
    } catch (err) {
      console.error("[jewel-concept] Together response non-JSON:", rawText.slice(0, 400));
      throw new Error("Risposta non valida da Together AI.");
    }

    const first = payload.data?.[0];
    if (!first) {
      console.error("[jewel-concept] Together empty data array");
      throw new Error("Risposta vuota da Together AI.");
    }

    let imageUrl: string;
    let pngBytes: Uint8Array;
    let pngMime = "image/png";
    if (first.b64_json) {
      imageUrl = `data:image/png;base64,${first.b64_json}`;
      const bin = atob(first.b64_json);
      pngBytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) pngBytes[i] = bin.charCodeAt(i);
    } else if (first.url) {
      // Fallback: scarica e converte in data URL così il resto del flusso
      // (incluso Trellis 2) può consumarlo come prima.
      try {
        const imgRes = await fetch(first.url);
        if (!imgRes.ok) {
          throw new Error(`download fallito (${imgRes.status})`);
        }
        pngMime = imgRes.headers.get("content-type") || "image/png";
        const buf = await imgRes.arrayBuffer();
        pngBytes = new Uint8Array(buf);
        const b64 = Buffer.from(buf).toString("base64");
        imageUrl = `data:${pngMime};base64,${b64}`;
      } catch (err) {
        console.error("[jewel-concept] Together image url fetch failed:", err);
        throw new Error("Impossibile recuperare l'immagine generata da Together.");
      }
    } else {
      throw new Error("Together AI non ha restituito né b64_json né url.");
    }

    // Upload su Fal.ai storage per ottenere un URL pubblico consumabile da Trellis 2.
    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      throw new Error(
        "Servizio temporaneamente non disponibile. La chiave Fal.ai non è configurata.",
      );
    }
    fal.config({ credentials: falKey });
    const ext = pngMime.includes("jpeg") || pngMime.includes("jpg")
      ? "jpg"
      : pngMime.includes("webp")
        ? "webp"
        : "png";
    const file = new File([pngBytes], `jewel.${ext}`, { type: pngMime });

    let trellisImageUrl: string;
    try {
      trellisImageUrl = await fal.storage.upload(file);
    } catch (err) {
      console.error("[jewel-concept] fal.storage.upload failed:", err);
      throw new Error(
        `Upload immagine su Fal storage fallito. ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
    if (!/^https?:\/\//i.test(trellisImageUrl)) {
      console.error("[jewel-concept] fal.storage non-HTTP URL:", trellisImageUrl);
      throw new Error("URL immagine non pubblico restituito da Fal storage.");
    }
    console.log("[jewel-concept] fal.storage upload OK:", trellisImageUrl);

    return { imageUrl, trellisImageUrl, prompt, endpoint, mode };
  });
