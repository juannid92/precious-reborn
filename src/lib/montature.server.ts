/**
 * Helper server-only per montature, configurazione sito e richieste.
 *
 * Il frontend NON parla mai con queste tabelle direttamente:
 * le server functions chiamano queste funzioni lato server.
 */
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

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
};

export async function caricaMontature(forma: string): Promise<Montatura[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("montature")
    .select("codice, nome, categoria, descrizione, metalli, forme_compatibili, carati_min, carati_max, immagine")
    .eq("attivo", true)
    .contains("forme_compatibili", [forma])
    .order("ordine", { ascending: true });

  if (error) {
    console.error("[montature] query error", error.message);
    return [];
  }

  return (data ?? []).map((r) => ({
    codice: String(r.codice),
    nome: String(r.nome),
    categoria: String(r.categoria),
    descrizione: r.descrizione ? String(r.descrizione) : null,
    metalli: Array.isArray(r.metalli) ? r.metalli.map(String) : [],
    forme_compatibili: Array.isArray(r.forme_compatibili) ? r.forme_compatibili.map(String) : [],
    carati_min: typeof r.carati_min === "number" ? r.carati_min : null,
    carati_max: typeof r.carati_max === "number" ? r.carati_max : null,
    immagine: r.immagine ? String(r.immagine) : null,
  }));
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
    })
    .select("id")
    .single();

  if (error) {
    console.error("[richieste] insert error", error.message);
    return null;
  }

  return data?.id ? String(data.id) : null;
}
