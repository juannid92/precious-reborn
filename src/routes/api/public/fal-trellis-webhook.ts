/**
 * Webhook pubblico per fal.ai Trellis 2.
 * Verifica la firma ED25519 ufficiale di fal.ai prima di aggiornare Supabase.
 */
import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyFalWebhook } from "@/lib/fal-webhook-verify";

type FalWebhookPayload = {
  request_id?: string;
  status?: "OK" | "ERROR" | string;
  payload?: { model_glb?: { url?: string } } | null;
  error?: string | null;
};

export const Route = createFileRoute("/api/public/fal-trellis-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = new Uint8Array(await request.arrayBuffer());
        if (!(await verifyFalWebhook(request, rawBody))) {
          console.warn("[fal-webhook] firma non valida");
          return new Response("Unauthorized", { status: 401 });
        }

        let body: FalWebhookPayload;
        try {
          body = JSON.parse(new TextDecoder().decode(rawBody)) as FalWebhookPayload;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const requestId = body.request_id;
        if (!requestId) return new Response("Missing request_id", { status: 400 });

        const supabase = getSupabaseAdmin();
        if (body.status === "OK") {
          const glbUrl = body.payload?.model_glb?.url;
          if (!glbUrl || !/^https:\/\//i.test(glbUrl)) {
            const { error } = await supabase
              .from("jewel_3d_jobs")
              .update({ status: "FAILED", error_message: "Risultato 3D non valido." })
              .eq("request_id", requestId);
            if (error) console.error("[fal-webhook] aggiornamento DB non riuscito");
            return new Response("ok", { status: 200 });
          }

          const { error } = await supabase
            .from("jewel_3d_jobs")
            .update({ status: "COMPLETED", glb_url: glbUrl, error_message: null })
            .eq("request_id", requestId);
          if (error) {
            console.error("[fal-webhook] aggiornamento DB non riuscito");
            return new Response("DB error", { status: 500 });
          }
          return new Response("ok", { status: 200 });
        }

        const safeError =
          body.status === "ERROR" ? "Generazione 3D non riuscita." : "Stato job non valido.";
        const { error } = await supabase
          .from("jewel_3d_jobs")
          .update({ status: "FAILED", error_message: safeError })
          .eq("request_id", requestId);
        if (error) {
          console.error("[fal-webhook] aggiornamento DB non riuscito");
          return new Response("DB error", { status: 500 });
        }
        return new Response("ok", { status: 200 });
      },
    },
  },
});
