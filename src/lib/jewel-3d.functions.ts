/**
 * Server functions — generazione bozza 3D del gioiello via Fal.ai Trellis 2.
 *
 * Architettura (Strada 1: Supabase esterno + webhook):
 *  - submitTrellis3DJob: birefnet → fal.queue.submit con webhook_url → INSERT in
 *    public.jewel_3d_jobs. Dedup per source_image_url (riusa requestId se job
 *    esistente non FAILED).
 *  - pollTrellis3DJob: legge lo stato dal DB Supabase (NON da Fal queue).
 *    Lo stato viene aggiornato dalla server route /api/public/fal-trellis-webhook
 *    quando Fal.ai chiama il webhook.
 *
 * Nota: il nome pollTrellis3DJob è mantenuto per compatibilità col frontend,
 * ma ora interroga solo il DB. Niente più polling diretto browser → Fal queue.
 */
import { createServerFn } from "@tanstack/react-start";
import { fal } from "@fal-ai/client";
import { z } from "zod";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

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
function ensureFalKey(): string {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error(
      "Servizio 3D temporaneamente non disponibile. La chiave Fal.ai non è configurata.",
    );
  }
  return apiKey;
}

function ensureWebhookSecret(): string {
  const s = process.env.FAL_WEBHOOK_SECRET;
  if (!s) {
    throw new Error("FAL_WEBHOOK_SECRET non configurato.");
  }
  return s;
}

/** URL pubblico stabile del sito (per il webhook Fal.ai). */
function publicWebhookUrl(): string {
  // Permettiamo un override esplicito via env per casi particolari.
  const explicit = process.env.PUBLIC_SITE_URL;
  const base = (
    explicit ||
    "https://precious-reborn.lovable.app"
  ).replace(/\/$/, "");
  const secret = encodeURIComponent(ensureWebhookSecret());
  return `${base}/api/public/fal-trellis-webhook?secret=${secret}`;
}

// ─── 1) Submit ──────────────────────────────────────────────────
export const submitTrellis3DJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SubmitInputSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitTrellis3DResult> => {
    fal.config({ credentials: ensureFalKey() });
    const supabase = getSupabaseAdmin();

    const sourceImageUrl = data.trellisImageUrl;
    console.log("[jewel-3d] submit chiamato per source:", sourceImageUrl);

    // ─── Dedup: cerca job esistente non FAILED per la stessa immagine ───
    {
      const { data: existing, error } = await supabase
        .from("jewel_3d_jobs")
        .select("request_id, status")
        .eq("source_image_url", sourceImageUrl)
        .neq("status", "FAILED")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("[jewel-3d] dedup query error:", error);
        // proseguiamo comunque col submit (non blocchiamo per errore di lettura)
      } else if (existing?.request_id) {
        console.log(
          "[jewel-3d] DEDUP: riuso job esistente requestId:",
          existing.request_id,
          "status:",
          existing.status,
        );
        return { requestId: existing.request_id };
      }
    }

    // ─── Step 1: birefnet (rimuove sfondo) ───
    let cleanImageUrl: string;
    try {
      const bgResult = (await fal.subscribe("fal-ai/birefnet", {
        input: {
          image_url: sourceImageUrl,
          model: "General Use (Light)",
        },
      })) as { data?: { image?: { url?: string } } };

      const url = bgResult.data?.image?.url;
      if (!url || !/^https?:\/\//i.test(url)) {
        throw new Error("birefnet: URL immagine pulita mancante o non valido.");
      }
      cleanImageUrl = url;
      console.log("[jewel-3d] birefnet OK, clean image:", cleanImageUrl);
    } catch (error) {
      console.error("[jewel-3d] birefnet error:", JSON.stringify(error, null, 2));
      throw new Error(`Fal.ai birefnet failed: ${JSON.stringify(error)}`);
    }

    // ─── Step 2: submit Trellis 2 con webhook ───
    const resolution = 1024 as const;
    const textureSize = 2048 as const;
    const meshSimplify = 0.95;
    const foregroundRatio = 0.92;

    const trellisInput = {
      image_url: cleanImageUrl,
      resolution,
      texture_size: textureSize,
      mesh_simplify: meshSimplify,
      remesh: true,
      foreground_ratio: foregroundRatio,
    };

    const webhookUrl = publicWebhookUrl();
    console.log(
      "[jewel-3d] Trellis 2 payload:",
      JSON.stringify(trellisInput, null, 2),
    );
    console.log("[jewel-3d] webhook_url:", webhookUrl.replace(/secret=[^&]+/, "secret=***"));

    let requestId: string;
    try {
      const submitted = await fal.queue.submit(ENDPOINT, {
        // I tipi TS del client indicano stringhe per resolution/texture_size,
        // ma il server valida come literal numerici. Cast per allinearsi al runtime.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input: trellisInput as any,
        webhookUrl,
      });
      requestId = submitted.request_id;
      console.log("[jewel-3d] Trellis 2 submitted, request_id:", requestId);
    } catch (error) {
      console.error("[jewel-3d] Fal.ai submit error:", JSON.stringify(error, null, 2));
      throw new Error(`Fal.ai trellis-2 submit failed: ${JSON.stringify(error)}`);
    }

    // ─── Step 3: persist nel DB ───
    const { error: insertError } = await supabase.from("jewel_3d_jobs").insert({
      request_id: requestId,
      source_image_url: sourceImageUrl,
      status: "SUBMITTED",
    });
    if (insertError) {
      // Race: se un altro submit ha già inserito lo stesso request_id, va bene.
      console.error("[jewel-3d] DB insert error:", insertError);
      // Non blocchiamo: il webhook lavora comunque per request_id.
    } else {
      console.log("[jewel-3d] DB insert OK requestId:", requestId);
    }

    return { requestId };
  });

// ─── 2) Poll (legge dal DB, NON da Fal queue) ──────────────────
export const pollTrellis3DJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PollInputSchema.parse(input))
  .handler(async ({ data }): Promise<PollTrellis3DResult> => {
    const supabase = getSupabaseAdmin();

    const { data: row, error } = await supabase
      .from("jewel_3d_jobs")
      .select("status, glb_url, error_message")
      .eq("request_id", data.requestId)
      .maybeSingle();

    if (error) {
      console.error("[jewel-3d] poll DB error:", error);
      return { status: "FAILED", error: "Errore nel recupero dello stato 3D dal DB." };
    }

    if (!row) {
      // Riga non ancora visibile (race insert) → trattiamo come in coda.
      return { status: "IN_QUEUE" };
    }

    console.log(
      "[jewel-3d] poll DB requestId:",
      data.requestId,
      "status:",
      row.status,
    );

    if (row.status === "COMPLETED") {
      if (!row.glb_url) {
        return { status: "FAILED", error: "Job completato ma glb_url mancante." };
      }
      return {
        status: "COMPLETED",
        glbUrl: row.glb_url,
        contentType: "model/gltf-binary",
        sizeBytes: 0,
      };
    }

    if (row.status === "FAILED") {
      return {
        status: "FAILED",
        error: row.error_message || "Generazione 3D fallita.",
      };
    }

    // SUBMITTED o IN_PROGRESS
    return {
      status: row.status === "IN_PROGRESS" ? "IN_PROGRESS" : "IN_QUEUE",
    };
  });
