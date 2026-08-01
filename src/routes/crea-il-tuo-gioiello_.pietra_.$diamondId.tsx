import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2, PlayCircle, Image as ImageIcon } from "lucide-react";
import { StoneMedia } from "@/components/jewelry/StoneMedia";

import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { contacts } from "@/content/site";
import { getNivodaDiamond } from "@/lib/nivoda.functions";
import { SELECTED_STONE_KEY, type NivodaDiamond } from "@/lib/nivoda-types";

export const Route = createFileRoute("/crea-il-tuo-gioiello_/pietra_/$diamondId")({
  head: () => ({
    meta: [
      { title: "Dettaglio pietra · Cara Preziosi" },
      {
        name: "description",
        content:
          "Scheda tecnica della pietra certificata selezionata: carati, colore, purezza, taglio e laboratorio di certificazione.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: DettaglioPietraPage,
});

const GLOSSARY: Array<{ term: string; text: string }> = [
  {
    term: "Carati",
    text: "Indicano il peso della pietra: più alto è il valore, più grande appare il diamante.",
  },
  {
    term: "Colore",
    text: "Misura quanto la pietra è incolore. Si va dalla D (totalmente incolore) verso lettere successive, con sfumature sempre più calde.",
  },
  {
    term: "Purezza",
    text: "Indica quante piccole inclusioni naturali sono presenti. IF è la più pura, poi seguono VVS, VS e SI.",
  },
  {
    term: "Taglio",
    text: "Valuta la lavorazione delle faccette: è ciò che determina quanto la pietra brilla.",
  },
  {
    term: "Tavola",
    text: "È la faccetta piana in cima al diamante, espressa in percentuale rispetto alla larghezza della pietra.",
  },
  {
    term: "Profondità",
    text: "L'altezza della pietra in rapporto alla sua larghezza: influenza brillantezza e proporzioni.",
  },
  {
    term: "Fluorescenza",
    text: "Reazione della pietra alla luce ultravioletta. Nella maggior parte dei casi non è visibile alla luce normale.",
  },
  {
    term: "Pulita a occhio nudo",
    text: "Significa che le inclusioni non si vedono senza lente d'ingrandimento, guardando la pietra a distanza naturale.",
  },
];

function DettaglioPietraPage() {

  const { diamondId } = Route.useParams();
  const navigate = useNavigate();
  const fetchDiamond = useServerFn(getNivodaDiamond);

  const [item, setItem] = useState<NivodaDiamond | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "missing">("loading");
  const [activeView, setActiveView] = useState<"video" | "image">("image");

  useEffect(() => {
    if (item && !item.image && item.video) {
      setActiveView("video");
    }
  }, [item]);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    fetchDiamond({ data: { diamondId } })
      .then((res) => {
        if (!alive) return;
        if (!res.item) {
          setStatus("missing");
          return;
        }
        setItem(res.item);
        setStatus("ready");
      })
      .catch(() => {
        if (alive) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [diamondId, fetchDiamond]);

  const title = item?.title ?? item?.shapeLabel ?? "Pietra certificata";

  type Row = { label: string; value: string | null };
  const clean = (rows: Row[]) =>
    rows.filter((r) => r.value != null && r.value !== "") as Array<{
      label: string;
      value: string;
    }>;

  const groups: Array<{ title: string; rows: Array<{ label: string; value: string }> }> = item
    ? [
        {
          title: "Le 4 C",
          rows: clean([
            { label: "Forma", value: item.shapeLabel },
            { label: "Carati", value: item.caratsLabel },
            { label: "Colore", value: item.color },
            { label: "Purezza", value: item.clarity },
            { label: "Taglio", value: item.cutLabel },
          ]),
        },
        {
          title: "Proporzioni",
          rows: clean([
            { label: "Misure", value: item.measurements },
            { label: "Rapporto", value: item.ratio },
            { label: "Tavola", value: item.tablePct },
            { label: "Profondità", value: item.depthPct },
            { label: "Angolo corona", value: item.crownAngle },
            { label: "Angolo padiglione", value: item.pavAngle },
            { label: "Cintura", value: item.girdle },
            { label: "Apice", value: item.culet },
            { label: "Lucidatura", value: item.polishLabel },
            { label: "Simmetria", value: item.symmetryLabel },
          ]),
        },
        {
          title: "Aspetto e provenienza",
          rows: clean([
            { label: "Pulita a occhio nudo", value: item.eyeClean },
            { label: "Lucentezza", value: item.luster },
            { label: "Sfumatura di colore", value: item.shade },
            { label: "Effetto bowtie", value: item.bowtie },
            {
              label: "Fluorescenza",
              value: item.fluorescence
                ? `${item.fluorescence}${item.fluorescenceColor ? ` (${item.fluorescenceColor})` : ""}`
                : null,
            },
            { label: "Tipo di taglio", value: item.cutStyle },
            { label: "Origine", value: item.natural },
            { label: "Paese d'origine", value: item.origin },
            { label: "Trattamenti", value: item.treated },
            {
              label: "Certificato",
              value: item.lab
                ? `${item.lab}${item.certNumber ? ` ${item.certNumber}` : ""}`
                : null,
            },
          ]),
        },
      ].filter((g) => g.rows.length > 0)
    : [];

  const contactSearch = item
    ? {
        richiesta: `Sono interessato alla pietra: ${title}`,
        pietra: item.diamondId ?? undefined,
      }
    : { richiesta: undefined, pietra: undefined };


  const chooseStone = () => {
    if (!item) return;
    try {
      window.localStorage.setItem(
        SELECTED_STONE_KEY,
        JSON.stringify({
          diamondId: item.diamondId,
          title,
          shapeLabel: item.shapeLabel,
          caratsLabel: item.caratsLabel,
          color: item.color,
          clarity: item.clarity,
          lab: item.lab,
          certNumber: item.certNumber,
          image: item.image,
        }),
      );
    } catch {
      /* storage non disponibile: si prosegue comunque */
    }
    void navigate({ to: "/contatti", search: contactSearch });
  };

  return (
    <main className="bg-bone text-ink">
      <section className="pt-36 md:pt-44 pb-24 md:pb-36">
        <div className="container-cara">
          <Link
            to="/crea-il-tuo-gioiello/pietra"
            className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-ink/60 hover:text-gold-deep transition-colors mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Torna al catalogo
          </Link>
          <PageBreadcrumb current="Dettaglio pietra" className="mb-10" />

          {status === "loading" && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento della scheda pietra…
            </div>
          )}

          {(status === "error" || status === "missing") && (
            <div className="rounded-2xl border border-ink/12 bg-bone/60 p-10 text-center">
              <p className="font-display text-2xl text-ink">
                {status === "missing"
                  ? "Questa pietra non è più disponibile"
                  : "Catalogo pietre momentaneamente non disponibile. Riprova tra qualche istante."}
              </p>
              <p className="mt-3 text-muted-foreground">
                Il catalogo cambia di continuo. Torna alla selezione per scegliere un'altra pietra.
              </p>
              <Link to="/crea-il-tuo-gioiello/pietra" className="btn-primary mt-8 inline-flex">
                Torna al catalogo
              </Link>
            </div>
          )}

          {status === "ready" && item && (
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Media */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl border border-ink/12 overflow-hidden bg-bone-deep/40 aspect-square">
                  <StoneMedia 
                    image={activeView === "image" || !item.video ? item.image : null} 
                    video={activeView === "video" ? item.video : null}
                    title={title}
                  />
                </div>

                {activeView === "video" && item.video && (
                  <p className="mt-3 text-[11px] text-ink/40 text-center">
                    Se il modello tridimensionale non compare, la pietra è in fase di aggiornamento presso il fornitore. Le fotografie e i dati del certificato restano validi.
                  </p>
                )}

                {item.video && item.image && (
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveView("image")}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        activeView === "image"
                          ? "bg-gold-deep text-bone shadow-md"
                          : "bg-bone border border-ink/10 text-ink/60 hover:border-gold-deep/40 hover:text-ink"
                      }`}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Fotografia
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView("video")}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        activeView === "video"
                          ? "bg-gold-deep text-bone shadow-md"
                          : "bg-bone border border-ink/10 text-ink/60 hover:border-gold-deep/40 hover:text-ink"
                      }`}
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      Video 360
                    </button>
                  </div>
                )}
              </div>

              {/* Dati */}
              <div className="lg:col-span-6">
                <p className="eyebrow text-gold-deep mb-5">
                  {item.available ? "Disponibile su richiesta" : "Verifica disponibilità"}
                </p>
                <h1
                  className="font-display leading-[1.05] text-ink"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
                >
                  {title}
                </h1>

                {item.description && (
                  <p className="mt-8 mb-10 text-base md:text-lg text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}

                {groups.length > 0 && (
                  <div className="grid gap-10 border-t border-ink/10 pt-8 md:grid-cols-2">
                    {groups.map((g) => (
                      <section key={g.title}>
                        <p className="eyebrow text-gold-deep mb-4">{g.title}</p>
                        <dl>
                          {g.rows.map((r) => (
                            <div
                              key={r.label}
                              className="flex items-baseline justify-between gap-4 border-b border-ink/8 py-2.5"
                            >
                              <dt className="text-sm text-ink/50">{r.label}</dt>
                              <dd className="text-sm text-ink text-right">{r.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    ))}
                  </div>
                )}

                <details className="mt-10 rounded-2xl border border-ink/12 bg-bone/60 px-6 py-4">
                  <summary className="cursor-pointer list-none text-[11px] uppercase tracking-[0.28em] text-ink/60 hover:text-gold-deep transition-colors">
                    Cosa significano questi valori
                  </summary>
                  <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                    {GLOSSARY.map((g) => (
                      <div key={g.term}>
                        <dt className="text-ink">{g.term}</dt>
                        <dd className="text-muted-foreground">{g.text}</dd>
                      </div>
                    ))}
                  </dl>
                </details>


                {item.certPdf && (
                  <a
                    href={item.certPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink/60 hover:text-gold-deep transition-colors"
                  >
                    Vedi il certificato
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <button type="button" onClick={chooseStone} className="btn-primary">
                    Scegli questa pietra
                  </button>
                  <Link
                    to="/contatti"
                    search={contactSearch}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink/60 hover:text-gold-deep transition-colors"
                  >
                    Richiedi un preventivo
                  </Link>
                </div>

                <p className="mt-10 text-sm text-muted-foreground leading-relaxed">
                  Il prezzo della pietra e della montatura viene definito insieme a te in base alla
                  creazione che sceglierai. Contattaci per un preventivo su misura.
                </p>

                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  Ogni pietra viene verificata dal maestro orafo Nicola Caradonna prima della
                  conferma dell'ordine. Per vederla dal vivo scrivici su{" "}
                  <a
                    href={contacts.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-deep hover:underline"
                  >
                    WhatsApp
                  </a>{" "}
                  o prenota una visita in atelier.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
