import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { contacts } from "@/content/site";
import { getNivodaDiamond } from "@/lib/nivoda.functions";
import {
  SELECTED_STONE_KEY,
  SHAPE_LABELS,
  formatCarats,
  formatEur,
  type NivodaDiamond,
} from "@/lib/nivoda-types";

export const Route = createFileRoute("/crea-il-tuo-gioiello_/pietra_/$diamondId")({
  head: () => ({
    meta: [
      { title: "Dettaglio pietra · Cara Preziosi" },
      {
        name: "description",
        content:
          "Scheda tecnica del diamante certificato selezionato: carati, colore, purezza, taglio e laboratorio di certificazione.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: DettaglioPietraPage,
});

function DettaglioPietraPage() {
  const { diamondId } = Route.useParams();
  const navigate = useNavigate();
  const fetchDiamond = useServerFn(getNivodaDiamond);

  const [item, setItem] = useState<NivodaDiamond | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "missing">("loading");

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

  const shapeLabel = item ? (SHAPE_LABELS[item.shape ?? ""] ?? item.shape ?? "—") : "—";

  const chooseStone = () => {
    if (!item) return;
    try {
      window.localStorage.setItem(
        SELECTED_STONE_KEY,
        JSON.stringify({
          diamondId: item.diamondId,
          shape: item.shape,
          shapeLabel,
          carats: item.carats,
          color: item.color,
          clarity: item.clarity,
          cutLabel: item.cutLabel,
          lab: item.lab,
          certNumber: item.certNumber,
          priceEur: item.priceEur,
          image: item.image,
        }),
      );
    } catch {
      /* storage non disponibile: si prosegue comunque */
    }
    void navigate({ to: "/crea-il-tuo-gioiello" });
  };

  const richiesta = item
    ? `Sono interessato/a alla pietra ${shapeLabel} da ${formatCarats(item.carats)}, colore ${item.color ?? "—"}, purezza ${item.clarity ?? "—"}${item.lab ? `, certificato ${item.lab}${item.certNumber ? ` n. ${item.certNumber}` : ""}` : ""} (rif. ${item.diamondId ?? "—"}).`
    : "";

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
                  : "Non siamo riusciti a caricare la pietra"}
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
                <div className="rounded-2xl border border-ink/12 overflow-hidden bg-bone-deep/40 aspect-square">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={`Diamante ${shapeLabel} ${formatCarats(item.carats)}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink/40">
                      Immagine non disponibile
                    </div>
                  )}
                </div>
                {item.video && (
                  <div className="mt-6 rounded-2xl border border-ink/12 overflow-hidden aspect-square">
                    <iframe
                      src={item.video}
                      title="Video 360 della pietra"
                      className="h-full w-full border-0"
                      allow="autoplay; fullscreen"
                    />
                  </div>
                )}
              </div>

              {/* Dati */}
              <div className="lg:col-span-6">
                <p className="eyebrow text-gold-deep mb-5">
                  {item.available ? "Disponibile su richiesta" : "Verifica disponibilità"}
                </p>
                <h1
                  className="font-display leading-[1.02] text-ink"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
                >
                  Diamante {shapeLabel}
                  <span className="block italic text-gold-deep">{formatCarats(item.carats)}</span>
                </h1>

                <p className="mt-8 font-display text-3xl text-ink">{formatEur(item.priceEur)}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Prezzo indicativo della sola pietra, IVA inclusa. La montatura viene quotata a
                  parte dopo il colloquio in atelier.
                </p>

                <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-ink/10 pt-8">
                  <Spec label="Forma" value={shapeLabel} />
                  <Spec label="Carati" value={formatCarats(item.carats)} />
                  <Spec label="Colore" value={item.color} />
                  <Spec label="Purezza" value={item.clarity} />
                  <Spec label="Taglio" value={item.cutLabel} />
                  <Spec label="Lucidatura" value={item.polish} />
                  <Spec label="Simmetria" value={item.symmetry} />
                  <Spec label="Fluorescenza" value={item.fluorescence} />
                  <Spec label="Laboratorio" value={item.lab} />
                  <Spec label="N. certificato" value={item.certNumber} />
                </dl>

                {item.certPdf && (
                  <a
                    href={item.certPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink/60 hover:text-gold-deep transition-colors"
                  >
                    Certificato originale
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <button type="button" onClick={chooseStone} className="btn-primary">
                    Scegli questa pietra
                  </button>
                  <Link
                    to="/contatti"
                    search={{ richiesta }}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink/60 hover:text-gold-deep transition-colors"
                  >
                    Richiedi informazioni
                  </Link>
                </div>

                <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
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

function Spec({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="eyebrow text-ink/45">{label}</dt>
      <dd className="mt-1.5 text-base text-ink">{value ?? "—"}</dd>
    </div>
  );
}
