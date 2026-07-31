/**
 * Helper server-only per il catalogo pietre di colore Nivoda.
 *
 * Il frontend NON parla mai con Nivoda: chiama una server function che a sua
 * volta invoca la edge function Supabase "nivoda-gemstones".
 */
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";
import type { Gemstone, GemstoneSearchResult } from "./gemstones-types";

async function invokeGemstones<T>(body: Record<string, unknown>): Promise<T> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.functions.invoke("nivoda-gemstones", { body });

  if (error) {
    console.error("[gemstones] invoke error", error.message);
    throw new Error("Catalogo pietre momentaneamente non raggiungibile.");
  }
  if (data && typeof data === "object" && "error" in (data as Record<string, unknown>)) {
    const message = String((data as { error: unknown }).error);
    console.error("[gemstones] function error", message);
    throw new Error(message);
  }
  return data as T;
}

export async function searchGemstones(
  body: Record<string, unknown>,
): Promise<GemstoneSearchResult> {
  const data = await invokeGemstones<{ items?: Gemstone[]; hasMore?: boolean }>(body);
  return { items: data.items ?? [], hasMore: Boolean(data.hasMore) };
}

export async function getGemstone(gemId: string): Promise<Gemstone | null> {
  const data = await invokeGemstones<{ item?: Gemstone }>({ gemId });
  return data.item ?? null;
}
