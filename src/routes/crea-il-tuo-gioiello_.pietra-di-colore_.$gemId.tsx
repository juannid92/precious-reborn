import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2, PlayCircle, Image as ImageIcon } from "lucide-react";
import { MediaPietraNivoda } from "@/components/MediaPietraNivoda";

import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { getNivodaGemstone } from "@/lib/gemstones.functions";
import type { Gemstone } from "@/lib/gemstones-types";

export const Route = createFileRoute("/crea-il-tuo-gioiello_/pietra-di-colore_/$gemId")({
  head: () => ({
    meta: [
      { title: "Dettaglio pietra di colore · Cara Preziosi" },
      {
        name: "description",
        content:
          "Scheda tecnica della gemma colorata certificata: tipo, forma, carati, colore, purezza, trattamento e origine.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: DettaglioPietraColorePage,
});

const GLOSSARY: Array<{ term: string; text: string }> = [
  {
    term: "Carati",
    text: "Indicano il peso della gemma: più alto è il valore, più grande appare la pietra.",
  },
  {
    term: "Purezza",
    text: "Descrive quante piccole inclusioni naturali sono presenti all'interno della gemma. Nelle pietre di colore alcune inclusioni sono normali e ne raccontano la natura.",
  },
  {
    term: "Taglio",
    text: "È la lavorazione delle faccette: determina come la gemma riflette la luce e quanto ne esalta il colore.",
  },
  {
    term: "Trattamento",
    text: "Alcune gemme vengono scaldate per uniformare il colore. Le pietre indicate come non trattate sono rimaste esattamente come le ha create la natura.",
  },
  {
    term: "Origine",
    text: "Indica il paese di provenienza della gemma: alcune miniere sono storicamente legate a colori particolarmente ricercati.",
  },
];

function DettaglioPietraColorePage() {
  const { gemId } = Route.useParams();
  const fetchGem = useServerFn(getNivodaGemstone);

  const [item, setItem] = useState<Gemstone | null>(null);
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
    fetchGem({ data: { gemId } })
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
  }, [gemId, fetchGem]);

  const title = item?.title ?? item?.gemLabel ?? "Pietra certificata";

  type Row = { label: string; value: string | null };
  const clean = (rows: Row[]) =>
    rows.filter((r) => r.value != null && r.value !== "") as Array<{
      label: string;
      value: string;
    }>;

  const groups: Array<{ title: string; rows: Array<{ label: string; value: string }> }> = item
    ? [
        {
          title: "Caratteristiche",
          rows: clean([
            { label: "Tipo di pietra", value: item.gemLabel },
            { label: "Forma", value: item.shapeLabel },
            { label: "Carati", value: item.caratsLabel },
            { label: "Colore", value: item.colorFull },
            { label: "Purezza", value: item.clarityLabel },
            { label: "Taglio", value: item.cutLabel },
          ]),
        },
        {
          title: "Misure",
          rows: clean([
            { label: "Misure", value: item.measurements },
            { label: "Rapporto", value: item.ratio },
            { label: "Tavola", value: item.tablePct },
          ]),
        },
        {
          title: "Origine e trattamento",
          rows: clean([
            { label: "Origine", value: item.origin },
            { label: "Trattamento", value: item.treatmentLabel },
            { label: "Pezzi", value: item.pieces },
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
        richiesta: "",
        pietra: encodeURIComponent(title),
        pid: encodeURIComponent(gemId),
        tipo: encodeURIComponent("gemma"),
      }
    : { richiesta: "", pietra: "", pid: "", tipo: "" };

  return (
    <main className="bg-bone text-ink">
      <section className="pt-36 md:pt-44 pb-24 md:pb-36">
        <div className="container-cara">
          <Link
            to="/crea-il-tuo-gioiello/pietra-di-colore"
            className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-ink/60 hover:text-gold-deep transition-colors mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Torna alle pietre di colore
          </Link>
          <PageBreadcrumb current="Dettaglio pietra di colore" className="mb-10" />

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
                Il catalogo cambia di continuo. Torna alla selezione per scegliere un'altra gemma.
              </p>
              <Link
                to="/crea-il-tuo-gioiello/pietra-di-colore"
                className="btn-primary mt-8 inline-flex"
              >
                Torna alle pietre di colore
              </Link>
            </div>
          )}

          {status === "ready" && item && (
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Media */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl border border-ink/12 overflow-hidden bg-bone-deep/40 aspect-square">
                  <MediaPietraNivoda 
                    image={activeView === "image" || !item.video ? item.image : null} 
                    video={activeView === "video" ? item.video : null}
                    alt={title}
                    interattivo={activeView === "video"}
                  />
                </div>


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
                  <Link to="/contatti" search={contactSearch} className="btn-primary">
                    Richiedi informazioni su questa pietra
                  </Link>
                  <Link
                    to="/crea-il-tuo-gioiello/pietra-di-colore"
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink/60 hover:text-gold-deep transition-colors"
                  >
                    Torna alle pietre di colore
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
