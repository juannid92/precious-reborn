/**
 * Supabase admin client per il TUO progetto Supabase ESTERNO.
 *
 * - NON è Lovable Cloud.
 * - Usa secrets EXT_SUPABASE_* (il prefisso SUPABASE_ è riservato da Lovable).
 * - Service role: BYPASSA RLS. Solo server. MAI importare nel client bundle.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.EXT_SUPABASE_URL;
  const serviceKey = process.env.EXT_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase esterno non configurato: mancano EXT_SUPABASE_URL o EXT_SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  _client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
