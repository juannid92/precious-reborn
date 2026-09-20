/**
 * Helper server-only per montature, configurazione sito e richieste.
 *
 * Il frontend NON parla mai con queste tabelle direttamente:
 * le server functions chiamano queste funzioni lato server.
 */
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

const MONTATURE_DIAG = "MONTATURE_DIAG";

export type Montatura = {
  codice: string;
  nome: string;
  categoria: string;
  descrizione: string | null;
  metalli: string[];
  forme_compatibili: string[];
  carati_min: number | null;
  carati_max: number | null;
  immagine: string | null;
};

export type SiteConfig = {
  whatsapp: string | null;
  email_richieste: string | null;
};

/** Configurazione completa del gioiello salvata nella richiesta. */
export type Configurazione = {
  version: 1;
  /** Tipo di testa: four_prongs | basket | peg_head | pave | single_halo | double_halo | crown | flower_halo | null */
  headType: string | null;
  /** Pietre sulla testa: diamonds | sapphire | null */
  headStoneType: string | null;
  /** Tipo di gambo: single | double | double_twist | knife_edge | square_edge | tapered | contemporary | hidden_halo | split | null */
  shankType: string | null;
  /** Pietra peek-a-boo: none | round_diamond | princess_diamond | null */
  peekaboo: string | null;
  /** Incastonatura laterale: none | u_pave | channel | prong | bead | pave | null */
  sideSetting: string | null;
  /** Tipo pietre laterali: lab_diamond | sapphire_alternating | emerald_alternating | ruby_alternating | null */
  sideStoneType: string | null;
  /** Lunghezza pietre laterali: half | three_quarters | null */
  sideStoneLength: string | null;
  /** Decorazione gambo: plain | leaf | scroll | null */
  carvingType: string | null;
  /** Metallo: gold | platinum | null */
  metalType: string | null;
  /** Qualita metallo: KT_9 | KT_14 | KT_18 | platinum | null */
  metalQuality: string | null;
  /** Colore testa: yellow_gold | white_gold | rose_gold | platinum | null */
  headMetalColor: string | null;
  /** Colore gambo: yellow_gold | white_gold | rose_gold | platinum | null */
  shankMetalColor: string | null;
  /** Testo incisione (max 24 caratteri) */
  engravingText: string;
  /** Sistema misura: UK | US | null */
  ringSizeSystem: string | null;
  /** Misura anello (dipende dal sistema) */
  ringSize: string | null;
};

export type RichiestaDati = {
  cliente_nome: string;
  cliente_email: string;
  cliente_telefono: string;
  pietra_tipo: string;
  pietra_id: string;
  pietra_titolo: string;
  gioiello: string;
  montatura_codice: string;
  metallo: string;
  misura: string;
  note: string;
  canale: string;
  /** Configurazione come oggetto (serializzato in JSONB) */
  configurazione?: Configurazione;
  /** Testo riepilogativo in italiano per il gioielliere */
  riepilogo_configurazione?: string | null;
  /** URL immagine della pietra */
  immagine_pietra?: string | null;
  /** URL immagine della montatura */
  immagine_montatura?: string | null;
  /** Stato iniziale della richiesta */
  stato: string;
};

const SELECT_COLS =
  "codice, nome, categoria, descrizione, metalli, forme_compatibili, carati_min, carati_max, immagine";

function mapRow(r: Record<string, unknown>): Montatura {
  return {
    codice: String(r.codice),
    nome: String(r.nome),
    categoria: String(r.categoria),
    descrizione: r.descrizione ? String(r.descrizione) : null,
    metalli: Array.isArray(r.metalli) ? r.metalli.map(String) : [],
    forme_compatibili: Array.isArray(r.forme_compatibili)
      ? r.forme_compatibili.map(String)
      : [],
    carati_min: typeof r.carati_min === "number" ? r.carati_min : null,
    carati_max: typeof r.carati_max === "number" ? r.carati_max : null,
    immagine: r.immagine ? String(r.immagine) : null,
  };
}

export async function caricaMontature(forma: string): Promise<Montatura[]> {
  const supabase = getSupabaseAdmin();

  const formaNorm = (forma ?? "").trim().toUpperCase();
  console.log(MONTATURE_DIAG, {
    formaRicevuta: forma,
    formaNormalizzata: formaNorm,
  });

  async function queryPerForma(f: string) {
    return supabase
      .from("montature")
      .select(SELECT_COLS)
      .eq("attivo", true)
      .contains("forme_compatibili", [f])
      .order("ordine", { ascending: true });
  }

  let result = await queryPerForma(formaNorm);
  let formaEffettiva = formaNorm;

  if (
    !result.error &&
    (result.data ?? []).length === 0 &&
    formaNorm.includes(" ")
  ) {
    const primaParola = formaNorm.split(/\s+/)[0];
    console.log(MONTATURE_DIAG, "retry con prima parola:", primaParola);
    const retry = await queryPerForma(primaParola);
    if (!retry.error && (retry.data ?? []).length > 0) {
      result = retry;
      formaEffettiva = primaParola;
    }
  }

  const { data, error } = result;

  if (error) {
    console.log(MONTATURE_DIAG, "DB error:", error.message, error.details, error.hint);
    return [];
  }

  console.log(MONTATURE_DIAG, {
    formaEffettiva,
    righeTrovate: (data ?? []).length,
  });

  return (data ?? []).map(mapRow);
}

export async function caricaConfigSito(): Promise<SiteConfig> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_config")
    .select("chiave, valore");

  if (error) {
    console.error("[site_config] query error", error.message);
    return { whatsapp: null, email_richieste: null };
  }

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    map.set(String(row.chiave), String(row.valore));
  }

  return {
    whatsapp: map.get("whatsapp") ?? null,
    email_richieste: map.get("email_richieste") ?? null,
  };
}

export async function salvaRichiesta(dati: RichiestaDati): Promise<string | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("richieste")
    .insert({
      cliente_nome: dati.cliente_nome,
      cliente_email: dati.cliente_email,
      cliente_telefono: dati.cliente_telefono,
      pietra_tipo: dati.pietra_tipo,
      pietra_id: dati.pietra_id,
      pietra_titolo: dati.pietra_titolo,
      gioiello: dati.gioiello,
      montatura_codice: dati.montatura_codice,
      metallo: dati.metallo,
      misura: dati.misura,
      note: dati.note,
      canale: dati.canale,
      stato: dati.stato,
      configurazione: dati.configurazione ?? {},
      riepilogo_configurazione: dati.riepilogo_configurazione ?? null,
      immagine_pietra: dati.immagine_pietra ?? null,
      immagine_montatura: dati.immagine_montatura ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[richieste] insert error", error.message);
    return null;
  }

  return data?.id ? String(data.id) : null;
}
