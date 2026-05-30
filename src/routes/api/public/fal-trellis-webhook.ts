/**
 * Webhook pubblico per Fal.ai Trellis 2.
 *
 * Riceve la callback quando il job 3D è completato/fallito e aggiorna la riga
 * corrispondente in public.jewel_3d_jobs (Supabase esterno).
 *
 * SICUREZZA: endpoint sotto /api/public/* → bypassa auth Lovable.
 * Verifica obbligatoria del secret in querystring (FAL_WEBHOOK_SECRET).
 *
 * Formato payload Fal.ai (sintetico):
 * {
 *   "request_id": "...",
 *   "status": "OK" | "ERROR",
 *   "payload": { ... risultato fal.queue.result ... } | null,
 *   "error": "..." | null
 * }
 */
import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

type FalWebhookPayload = {
  request_id?: string;
  status?: "OK" | "ERROR" | string;
  payload?: {
    model_glb?: { url?: string };
  } | null;
  error?: string | null;
};

export const Route = createFileRoute("/api/public/fal-trellis-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Verifica secret
        const url = new URL(request.url);
        const providedSecret = url.searchParams.get("secret");
        const expectedSecret = process.env.FAL_WEBHOOK_SECRET;
        if (!expectedSecret) {
          console.error("[fal-webhook] FAL_WEBHOOK_SECRET non configurato");
          return new Response("Server misconfiguration", { status: 500 });
        }
        if (!providedSecret || providedSecret !== expectedSecret) {
          console.warn("[fal-webhook] secret non valido o assente");
          return new Response("Unauthorized", { status: 401 });
        }

        // 2. Parse payload
        let body: FalWebhookPayload;
        try {
          body = (await request.json()) as FalWebhookPayload;
        } catch (err) {
          console.error("[fal-webhook] JSON parse error:", err);
          return new Response("Invalid JSON", { status: 400 });
        }

        const requestId = body.request_id;
        if (!requestId) {
          console.error("[fal-webhook] payload senza request_id:", body);
          return new Response("Missing request_id", { status: 400 });
        }

        console.log(
          "[fal-webhook] ricevuto requestId:",
          requestId,
          "status:",
          body.status,
        );

        // 3. Aggiorna DB
        const supabase = getSupabaseAdmin();

        if (body.status === "OK") {
          const glbUrl = body.payload?.model_glb?.url;
          if (!glbUrl) {
            console.error(
              "[fal-webhook] requestId",
              requestId,
              "OK ma model_glb.url mancante. Payload:",
              JSON.stringify(body.payload),
            );
            const { error } = await supabase
              .from("jewel_3d_jobs")
              .update({
                status: "FAILED",
                error_message: "Webhook OK ma model_glb.url mancante.",
              })
              .eq("request_id", requestId);
            if (error) console.error("[fal-webhook] update DB error:", error);
            return new Response("ok", { status: 200 });
          }

          const { error } = await supabase
            .from("jewel_3d_jobs")
            .update({
              status: "COMPLETED",
              glb_url: glbUrl,
              error_message: null,
            })
            .eq("request_id", requestId);
          if (error) {
            console.error("[fal-webhook] update COMPLETED error:", error);
            return new Response("DB error", { status: 500 });
          }
          console.log(
            "[fal-webhook] DB aggiornato COMPLETED requestId:",
            requestId,
            "glb_url:",
            glbUrl,
          );
          return new Response("ok", { status: 200 });
        }

        // status ERROR (o altro non-OK)
        const errMsg =
          body.error || `Job Fal.ai fallito (status: ${body.status ?? "unknown"}).`;
        const { error } = await supabase
          .from("jewel_3d_jobs")
          .update({
            status: "FAILED",
            error_message: errMsg,
          })
          .eq("request_id", requestId);
        if (error) {
          console.error("[fal-webhook] update FAILED error:", error);
          return new Response("DB error", { status: 500 });
        }
        console.log(
          "[fal-webhook] DB aggiornato FAILED requestId:",
          requestId,
          "error:",
          errMsg,
        );
        return new Response("ok", { status: 200 });
      },
    },
  },
});
