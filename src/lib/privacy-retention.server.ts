import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

const CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000;
const REQUEST_RETENTION_MONTHS = 24;
const JOB_RETENTION_DAYS = 90;

let lastCleanupAt = 0;
let cleanupInFlight: Promise<void> | null = null;

/**
 * Elimina i dati scaduti con credenziali server-side.
 * Viene eseguita al massimo una volta ogni sei ore per istanza applicativa.
 */
export async function enforcePrivacyRetention(): Promise<void> {
  if (Date.now() - lastCleanupAt < CLEANUP_INTERVAL_MS) return;
  if (cleanupInFlight) return cleanupInFlight;

  cleanupInFlight = (async () => {
    const supabase = getSupabaseAdmin();
    const requestCutoff = new Date();
    requestCutoff.setUTCMonth(requestCutoff.getUTCMonth() - REQUEST_RETENTION_MONTHS);
    const jobCutoff = new Date(Date.now() - JOB_RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const [requestsResult, jobsResult] = await Promise.all([
      supabase.from("richieste").delete().lt("created_at", requestCutoff.toISOString()),
      supabase.from("jewel_3d_jobs").delete().lt("created_at", jobCutoff.toISOString()),
    ]);

    if (requestsResult.error) console.warn("[privacy-retention] pulizia richieste non riuscita");
    if (jobsResult.error) console.warn("[privacy-retention] pulizia job 3D non riuscita");
    if (!requestsResult.error && !jobsResult.error) lastCleanupAt = Date.now();
  })().finally(() => {
    cleanupInFlight = null;
  });

  return cleanupInFlight;
}
