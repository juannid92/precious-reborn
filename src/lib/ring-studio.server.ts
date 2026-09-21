import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

export type RingStudioPreviewResult = {
  images: { down: string; front: string; side: string };
  supplierSku: string | null;
  title: string | null;
  description: string | null;
  ringWeight: number | null;
  ringWidth: string | null;
};

export async function loadRingStudioPreview(input: {
  sku_id?: string;
  options: Record<string, string | null>;
}): Promise<RingStudioPreviewResult> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.functions.invoke("nivoda-ring-configurator", { body: input });
  if (error) throw new Error("Anteprima fotografica momentaneamente non disponibile.");
  if (!data || typeof data !== "object" || "error" in data || !(data as RingStudioPreviewResult).images) {
    throw new Error("Anteprima fotografica momentaneamente non disponibile.");
  }
  return data as RingStudioPreviewResult;
}
