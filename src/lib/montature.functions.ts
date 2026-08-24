/**
 * Server functions — montature e richieste.
 * Thin wrapper: la logica vive in ./montature.server.ts.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  caricaMontature,
  caricaConfigSito,
  salvaRichiesta,
  type Montatura,
  type SiteConfig,
  type RichiestaDati,
} from "./montature.server";

const FormaSchema = z.object({ forma: z.string().min(1).max(64) });

export const getMontature = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => FormaSchema.parse(input))
  .handler(async ({ data }): Promise<Montatura[]> => {
    return caricaMontature(data.forma);
  });

export const getConfigSito = createServerFn({ method: "POST" })
  .inputValidator(() => undefined as void)
  .handler(async (): Promise<SiteConfig> => {
    return caricaConfigSito();
  });

const RichiestaSchema = z.object({
  cliente_nome: z.string().min(1).max(200),
  cliente_email: z.string().min(1).max(320),
  cliente_telefono: z.string().max(64),
  pietra_tipo: z.string().max(32),
  pietra_id: z.string().max(128),
  pietra_titolo: z.string().max(500),
  gioiello: z.string().max(64),
  montatura_codice: z.string().max(64),
  metallo: z.string().max(64),
  misura: z.string().max(32),
  note: z.string().max(2000),
  canale: z.string().max(32),
});

export const inviaRichiesta = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RichiestaSchema.parse(input))
  .handler(async ({ data }): Promise<{ id: string | null }> => {
    const id = await salvaRichiesta(data as RichiestaDati);
    return { id };
  });
