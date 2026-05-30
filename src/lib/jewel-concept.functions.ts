/**
 * Server functions — generazione concept gioiello via Fal.ai GPT Image 2.
 *
 * PROVIDER: Fal.ai — modello `fal-ai/gpt-image-2`.
 *
 * Per evitare timeout del worker (GPT Image 2 in "high" quality può superare
 * il limite sincrono), il flusso è asincrono via queue:
 *   - submitJewelConceptJob: costruisce il prompt, carica eventuale
 *     ispirazione su Fal storage e sottomette il job → ritorna requestId.
 *   - pollJewelConceptJob: controlla lo stato e, se completato, ritorna
 *     l'URL dell'immagine generata.
 *
 * SICUREZZA:
 * - FAL_KEY letta SOLO dentro .handler() (mai bundled lato client).
 * - Validazione input con Zod.
 */
import { createServerFn } from "@tanstack/react-start";
import { fal } from "@fal-ai/client";
import { z } from "zod";
import { assertTrustedOrigin } from "./ai-guard";

const ENDPOINT = "fal-ai/gpt-image-2";

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

const PollInputSchema = z.object({
  requestId: z.string().min(1).max(256),
});

export type JewelConceptInput = z.infer<typeof JewelInputSchema>;

export type SubmitJewelConceptResult = {
  requestId: string;
  prompt: string;
  endpoint: string;
  mode: "text-to-image" | "image-to-image";
};

export type PollJewelConceptResult =
  | { status: "IN_QUEUE" | "IN_PROGRESS"; requestId: string }
  | {
      status: "COMPLETED";
      requestId: string;
      imageUrl: string;
      trellisImageUrl: string;
      endpoint: string;
    }
  | { status: "FAILED"; requestId: string; error: string };

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

  return `${description} professional jewelry product photography, isometric view, 45-degree angle, flat white background, soft diffused studio lighting, no harsh reflections, no specular highlights, sharp focus on all edges, clean geometry visible, no shadows on background, top-lit, even illumination, suitable for 3D reconstruction, no people, no hands, no human, no model, not worn, luxury jewelry catalog style.`;
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Data URL non valido per l'ispirazione.");
  const mime = match[1];
  const bin = atob(match[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new File([bytes as unknown as BlobPart], filename, { type: mime });
}

function ensureKey(): string {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error(
      "Servizio temporaneamente non disponibile. La chiave Fal.ai non è configurata.",
    );
  }
  return apiKey;
}

// ─── 1) Submit ──────────────────────────────────────────────────
export const submitJewelConceptJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => JewelInputSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitJewelConceptResult> => {
    assertTrustedOrigin();
    fal.config({ credentials: ensureKey() });

    const prompt = buildPrompt(data);
    const hasReference = Boolean(data.inspirationDataUrl);
    const mode: "text-to-image" | "image-to-image" = hasReference
      ? "image-to-image"
      : "text-to-image";

    // Se presente un'ispirazione, caricala su Fal storage per ottenere un URL pubblico.
    let inspirationUrl: string | undefined;
    if (hasReference && data.inspirationDataUrl) {
      try {
        const refFile = dataUrlToFile(data.inspirationDataUrl, "inspiration");
        inspirationUrl = await fal.storage.upload(refFile);
      } catch (err) {
        console.error("[jewel-concept] inspiration upload failed:", err);
        throw new Error("Upload dell'immagine di ispirazione non riuscito. Riprova.");
      }
    }

    const input: Record<string, unknown> = {
      prompt,
      image_size: { width: 1536, height: 1536 },
      quality: "high",
      n: 1,
    };
    if (inspirationUrl) {
      input.image_urls = [inspirationUrl];
    }

    try {
      const submitted = await fal.queue.submit(ENDPOINT, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input: input as any,
      });
      console.log("[jewel-concept] submitted, request_id:", submitted.request_id);
      return {
        requestId: submitted.request_id,
        prompt,
        endpoint: ENDPOINT,
        mode,
      };
    } catch (err) {
      console.error("[jewel-concept] Fal GPT Image 2 submit error:", err);
      throw new Error("Generazione del concept non riuscita. Riprova più tardi.");
    }
  });

// ─── 2) Poll ────────────────────────────────────────────────────
export const pollJewelConceptJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PollInputSchema.parse(input))
  .handler(async ({ data }): Promise<PollJewelConceptResult> => {
    fal.config({ credentials: ensureKey() });

    let status: { status: string };
    try {
      status = (await fal.queue.status(ENDPOINT, {
        requestId: data.requestId,
        logs: false,
      })) as { status: string };
    } catch (err) {
      console.error("[jewel-concept] status error:", err);
      return {
        status: "FAILED",
        requestId: data.requestId,
        error: "Errore nel controllo dello stato immagine.",
      };
    }

    if (status.status === "COMPLETED") {
      let result: { data?: { images?: Array<{ url?: string }> } };
      try {
        result = (await fal.queue.result(ENDPOINT, {
          requestId: data.requestId,
        })) as typeof result;
      } catch (err) {
        console.error("[jewel-concept] result error:", err);
        return {
          status: "FAILED",
          requestId: data.requestId,
          error: "Errore nel recupero del risultato immagine.",
        };
      }
      const imageUrl = result.data?.images?.[0]?.url;
      if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
        console.error("[jewel-concept] risposta inattesa:", result);
        return {
          status: "FAILED",
          requestId: data.requestId,
          error: "Fal.ai non ha restituito un URL immagine valido.",
        };
      }
      console.log("[jewel-concept] COMPLETED, imageUrl:", imageUrl);
      return {
        status: "COMPLETED",
        requestId: data.requestId,
        imageUrl,
        trellisImageUrl: imageUrl,
        endpoint: ENDPOINT,
      };
    }

    if (status.status === "FAILED") {
      console.error("[jewel-concept] job FAILED:", status);
      return {
        status: "FAILED",
        requestId: data.requestId,
        error: "Generazione immagine fallita.",
      };
    }

    return {
      status: status.status === "IN_PROGRESS" ? "IN_PROGRESS" : "IN_QUEUE",
      requestId: data.requestId,
    };
  });
