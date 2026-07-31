/**
 * Server functions — catalogo pietre di colore Nivoda.
 * Thin wrapper: la logica vive in ./gemstones.server.ts.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { searchGemstones, getGemstone } from "./gemstones.server";
import type { Gemstone, GemstoneSearchResult } from "./gemstones-types";

const SearchSchema = z.object({
  types: z.array(z.string().max(32)).max(20).optional(),
  color: z.array(z.string().max(24)).max(20).optional(),
  shapes: z.array(z.string().max(24)).max(20).optional(),
  caratFrom: z.number().min(0).max(100).optional(),
  caratTo: z.number().min(0).max(100).optional(),
  sort: z.enum(["carat_asc", "carat_desc"]).optional(),
  page: z.number().int().min(0).max(200).optional(),
  pageSize: z.number().int().min(1).max(50).optional(),
});

const DetailSchema = z.object({ gemId: z.string().min(1).max(128) });

export const searchNivodaGemstones = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SearchSchema.parse(input))
  .handler(async ({ data }): Promise<GemstoneSearchResult> => {
    return searchGemstones(data as Record<string, unknown>);
  });

export const getNivodaGemstone = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DetailSchema.parse(input))
  .handler(async ({ data }): Promise<{ item: Gemstone | null }> => {
    return { item: await getGemstone(data.gemId) };
  });
