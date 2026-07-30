/**
 * Server functions — catalogo diamanti Nivoda.
 * Thin wrapper: la logica vive in ./nivoda.server.ts.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { searchDiamonds, getDiamond } from "./nivoda.server";
import type { NivodaDiamond, NivodaSearchResult } from "./nivoda-types";

const SearchSchema = z.object({
  shapes: z.array(z.string().max(24)).max(20).optional(),
  color: z.array(z.string().max(4)).max(12).optional(),
  clarity: z.array(z.string().max(6)).max(12).optional(),
  cut: z.array(z.string().max(4)).max(8).optional(),
  labs: z.array(z.string().max(6)).max(8).optional(),
  caratFrom: z.number().min(0).max(50).optional(),
  caratTo: z.number().min(0).max(50).optional(),
  priceFrom: z.number().min(0).max(1_000_000).optional(),
  priceTo: z.number().min(0).max(1_000_000).optional(),
  sort: z.enum(["price_asc", "price_desc", "carat_desc"]).optional(),
  page: z.number().int().min(0).max(200).optional(),
  pageSize: z.number().int().min(1).max(50).optional(),
});

const DetailSchema = z.object({ diamondId: z.string().min(1).max(128) });

export const searchNivodaDiamonds = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SearchSchema.parse(input))
  .handler(async ({ data }): Promise<NivodaSearchResult> => {
    return searchDiamonds(data as Record<string, unknown>);
  });

export const getNivodaDiamond = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DetailSchema.parse(input))
  .handler(async ({ data }): Promise<{ item: NivodaDiamond | null }> => {
    return { item: await getDiamond(data.diamondId) };
  });
