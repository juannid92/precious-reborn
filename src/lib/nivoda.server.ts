/**
 * Helper server-only per il catalogo diamanti Nivoda.
 *
 * Il frontend NON parla mai con Nivoda: chiama una server function che a sua
 * volta invoca la edge function Supabase "nivoda-diamonds".
 */
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";
import type { NivodaDiamond, NivodaSearchResult } from "./nivoda-types";

async function invokeNivoda<T>(body: Record<string, unknown>): Promise<T> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.functions.invoke("nivoda-diamonds", { body });

  if (error) {
    console.error("[nivoda] invoke error", error.message);
    throw new Error("Catalogo pietre momentaneamente non raggiungibile.");
  }
  if (data && typeof data === "object" && "error" in (data as Record<string, unknown>)) {
    console.error("[nivoda] function error", (data as { error: string }).error);
    throw new Error("Catalogo pietre momentaneamente non raggiungibile.");
  }
  return data as T;
}

export async function searchDiamonds(
  body: Record<string, unknown>,
): Promise<NivodaSearchResult> {
  const data = await invokeNivoda<{ items?: NivodaDiamond[]; hasMore?: boolean }>(body);
  return { items: data.items ?? [], hasMore: Boolean(data.hasMore) };
}

export async function getDiamond(diamondId: string): Promise<NivodaDiamond | null> {
  const data = await invokeNivoda<{ item?: NivodaDiamond }>({ diamondId });
  return data.item ?? null;
}
