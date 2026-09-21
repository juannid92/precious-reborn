import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

export type RingStudioPreviewResult = {
  images: { down: string; front: string; side: string };
  supplierSku: string | null;
  title: string | null;
  description: string | null;
  ringWeight: number | null;
  ringWidth: string | null;
};

type RpcError = { message: string } | null;
type RingStudioRpcClient = {
  rpc: (
    functionName: "ring_studio_preview",
    parameters: { p_options: Record<string, string | null>; p_sku_id: string },
  ) => Promise<{ data: unknown; error: RpcError }>;
};

const DEFAULT_MANUFACTURER_SKU = "6FQ5XKV6B0L1M4Z";

function isPreviewResult(value: unknown): value is RingStudioPreviewResult {
  if (!value || typeof value !== "object") return false;
  const images = (value as { images?: unknown }).images;
  if (!images || typeof images !== "object") return false;
  const candidate = images as Record<string, unknown>;
  return ["down", "front", "side"].every(
    (key) => typeof candidate[key] === "string" && candidate[key].length > 0,
  );
}

export async function loadRingStudioPreview(input: {
  sku_id?: string;
  options: Record<string, string | null>;
}): Promise<RingStudioPreviewResult> {
  const supabase = getSupabaseAdmin();
  const rpc = supabase as unknown as RingStudioRpcClient;

  const { data, error } = await rpc.rpc("ring_studio_preview", {
    p_options: input.options,
    p_sku_id: input.sku_id ?? DEFAULT_MANUFACTURER_SKU,
  });

  if (error) {
    console.error("[ring-studio] RPC error", error.message);
    throw new Error("Anteprima fotografica momentaneamente non disponibile.");
  }

  if (!isPreviewResult(data)) {
    console.error("[ring-studio] Invalid RPC response");
    throw new Error("Anteprima fotografica momentaneamente non disponibile.");
  }

  return data;
}
