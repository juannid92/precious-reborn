import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { loadRingStudioPreview, type RingStudioPreviewResult } from "./ring-studio.server";

const value = z.string().max(64).nullable();
const OptionsSchema = z.object({
  center_stone_shape: value,
  center_stone_size: value,
  center_stone_type: value,
  head_stones_quality: value,
  head_stones_type: value,
  metal_quality: value,
  metal_type: value,
  mounting_metal_color: value,
  mounting_type: value,
  peekaboo_stone: value,
  ring_carving_length: value,
  ring_carving_type: value,
  ring_engraving_font: value,
  ring_head_metal_color: value,
  ring_head_type: value,
  ring_size: value,
  ring_size_type: value,
  side_setting_type: value,
  side_stones_mounting_length: value,
  side_stones_type: value,
});

const InputSchema = z.object({ sku_id: z.string().max(64).optional(), options: OptionsSchema });

export const getRingStudioPreview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<RingStudioPreviewResult> => loadRingStudioPreview(data));
