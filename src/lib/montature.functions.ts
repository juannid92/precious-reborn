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

const ConfigurazioneSchema = z.object({
  version: z.literal(1),
  headType: z.string().nullable(),
  headStoneType: z.string().nullable(),
  shankType: z.string().nullable(),
  peekaboo: z.string().nullable(),
  sideSetting: z.string().nullable(),
  sideStoneType: z.string().nullable(),
  sideStoneLength: z.string().nullable(),
  carvingType: z.string().nullable(),
  metalType: z.string().nullable(),
  metalQuality: z.string().nullable(),
  headMetalColor: z.string().nullable(),
  shankMetalColor: z.string().nullable(),
  engravingText: z.string(),
  ringSizeSystem: z.string().nullable(),
  ringSize: z.string().nullable(),
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
  metallo: z.string().max(200),
  misura: z.string().max(32),
  note: z.string().max(2000),
  canale: z.string().max(32),
  /** Configurazione come oggetto */
  configurazione: ConfigurazioneSchema,
  /** Testo riepilogativo in italiano */
  riepilogo_configurazione: z.string().max(4000).nullable(),
  /** URL immagine pietra */
  immagine_pietra: z.string().max(1000).nullable(),
  /** URL immagine montatura */
  immagine_montatura: z.string().max(1000).nullable(),
});

export const inviaRichiesta = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RichiestaSchema.parse(input))
  .handler(async ({ data }): Promise<{ id: string | null }> => {
    const richiestaDati: RichiestaDati = {
      cliente_nome: data.cliente_nome,
      cliente_email: data.cliente_email,
      cliente_telefono: data.cliente_telefono,
      pietra_tipo: data.pietra_tipo,
      pietra_id: data.pietra_id,
      pietra_titolo: data.pietra_titolo,
      gioiello: data.gioiello,
      montatura_codice: data.montatura_codice,
      metallo: data.metallo,
      misura: data.misura,
      note: data.note,
      canale: data.canale,
      configurazione: data.configurazione,
      riepilogo_configurazione: data.riepilogo_configurazione ?? null,
      immagine_pietra: data.immagine_pietra ?? null,
      immagine_montatura: data.immagine_montatura ?? null,
      stato: "ricevuta",
    };
    const id = await salvaRichiesta(richiestaDati);
    return { id };
  });
