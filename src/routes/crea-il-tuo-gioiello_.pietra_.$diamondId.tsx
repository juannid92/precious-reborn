import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

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

  const title = item?.title ?? item?.shapeLabel ?? "Pietra certificata";

  const specs: Array<{ label: string; value: string | null }> = item
    ? [
        { label: "Forma", value: item.shapeLabel },
        { label: "Carati", value: item.caratsLabel },
        { label: "Colore", value: item.color },
        { label: "Purezza", value: item.clarity },
        { label: "Taglio", value: item.cutLabel },
        { label: "Lucidatura", value: item.polishLabel },
        { label: "Simmetria", value: item.symmetryLabel },
        { label: "Fluorescenza", value: item.fluorescence },
        {
          label: "Certificato",
          value: item.lab ? `${item.lab}${item.certNumber ? ` ${item.certNumber}` : ""}` : null,
        },
      ].filter((s) => s.value != null && s.value !== "")
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
                <div className="rounded-2xl border border-ink/12 overflow-hidden bg-bone-deep/40 aspect-square">
                  {item.video ? (
                    <video
                      src={item.video}
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={item.image ?? undefined}
                    />
                  ) : item.image ? (
                    <img src={item.image} alt={title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink/40">
                      Immagine non disponibile
                    </div>
                  )}
                </div>
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

                {specs.length > 0 && (
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-ink/10 pt-8">
                    {specs.map((s) => (
                      <div key={s.label}>
                        <dt className="eyebrow text-ink/45">{s.label}</dt>
                        <dd className="mt-1.5 text-base text-ink">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

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
