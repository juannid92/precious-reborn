import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, RotateCcw, Search } from "lucide-react";

import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchNivodaDiamonds } from "@/lib/nivoda.functions";
import {
  CARAT_MAX,
  CARAT_MIN,
  CLARITIES,
  COLORS,
  CUTS,
  LABS,
  PAGE_SIZE,
  PRICE_MAX,
  PRICE_MIN,
  SHAPES,
  SHAPE_LABELS,
  formatCarats,
  formatEur,
  type NivodaDiamond,
  type NivodaSort,
} from "@/lib/nivoda-types";

export const Route = createFileRoute("/crea-il-tuo-gioiello_/pietra")({
  head: () => ({
    meta: [
      { title: "Scegli la pietra · Cara Preziosi" },
      {
        name: "description",
        content:
          "Seleziona il diamante certificato del tuo gioiello su misura: forma, carati, colore e purezza. Pietre disponibili su richiesta nell'atelier di Bari.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Scegli la pietra · Cara Preziosi" },
      {
        property: "og:description",
        content:
          "Diamanti certificati selezionati, disponibili su richiesta presso l'atelier Cara Preziosi di Bari.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PietraPage,
});

type Filters = {
  shapes: string[];
  color: string[];
  clarity: string[];
  cut: string[];
  labs: string[];
  carat: [number, number];
  price: [number, number];
  sort: NivodaSort;
};

const DEFAULT_FILTERS: Filters = {
  shapes: [],
  color: [],
  clarity: [],
  cut: [],
  labs: [],
  carat: [CARAT_MIN, CARAT_MAX],
  price: [PRICE_MIN, PRICE_MAX],
  sort: "price_asc",
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function buildBody(f: Filters, page: number) {
  const body: Record<string, unknown> = {
    caratFrom: f.carat[0],
    caratTo: f.carat[1],
    priceFrom: f.price[0],
    priceTo: f.price[1],
    sort: f.sort,
    page,
    pageSize: PAGE_SIZE,
  };
  if (f.shapes.length) body.shapes = f.shapes;
  if (f.color.length) body.color = f.color;
  if (f.clarity.length) body.clarity = f.clarity;
  if (f.cut.length) body.cut = f.cut;
  if (f.labs.length) body.labs = f.labs;
  return body;
}

function PietraPage() {
  const search = useServerFn(searchNivodaDiamonds);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [items, setItems] = useState<NivodaDiamond[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "loadingMore" | "error">("loading");

  // filtri effettivamente applicati all'ultima ricerca
  const appliedRef = useRef<Filters>(DEFAULT_FILTERS);
  const firstLoad = useRef(true);

  const run = useCallback(
    async (f: Filters, nextPage: number, append: boolean) => {
      setStatus(append ? "loadingMore" : "loading");
      try {
        const res = await search({ data: buildBody(f, nextPage) });
        setItems((prev) => (append ? [...prev, ...res.items] : res.items));
        setHasMore(res.hasMore);
        setPage(nextPage);
        appliedRef.current = f;
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    },
    [search],
  );

  useEffect(() => {
    if (!firstLoad.current) return;
    firstLoad.current = false;
    void run(DEFAULT_FILTERS, 0, false);
  }, [run]);

  const busy = status === "loading";

  return (
    <main className="bg-bone text-ink">
      <section className="relative pt-36 md:pt-44 pb-12 md:pb-16 overflow-hidden">
        <span
          className="glow-orb glow-orb-bone block"
          style={{ width: "680px", height: "680px", top: "-12%", right: "-200px" }}
        />
        <div className="container-cara relative">
          <Link
            to="/crea-il-tuo-gioiello"
            className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-ink/60 hover:text-gold-deep transition-colors mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Torna al configuratore
          </Link>
          <PageBreadcrumb current="Scegli la pietra" className="mb-8" />
          <p className="eyebrow text-gold-deep mb-6">Passo 01 · La pietra</p>
          <h1
            className="font-display leading-[1] text-ink max-w-[16ch]"
            style={{ fontSize: "clamp(2.3rem, 5vw, 4.5rem)" }}
          >
            Scegli la pietra<span className="italic text-gold-deep"> del tuo gioiello.</span>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Una selezione di diamanti certificati dai principali laboratori internazionali
            (GIA, IGI, HRD), disponibili su richiesta. Ogni pietra viene verificata dal maestro
            orafo prima della conferma: qui scegli il punto di partenza, il resto del gioiello
            nasce con te in atelier.
          </p>
        </div>
      </section>

      <section className="pb-32 md:pb-44">
        <div className="container-cara">
          {/* ── Filtri ── */}
          <div className="rounded-2xl border border-ink/12 bg-bone/60 p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <FilterBlock label="Forma">
                <div className="flex flex-wrap gap-2">
                  {SHAPES.map((s) => (
                    <Chip
                      key={s}
                      active={filters.shapes.includes(s)}
                      onClick={() =>
                        setFilters((f) => ({ ...f, shapes: toggle(f.shapes, s) }))
                      }
                    >
                      {SHAPE_LABELS[s] ?? s}
                    </Chip>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock label={`Carati · ${filters.carat[0].toFixed(2)} – ${filters.carat[1].toFixed(2)}`}>
                <Slider
                  value={filters.carat}
                  min={CARAT_MIN}
                  max={CARAT_MAX}
                  step={0.1}
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, carat: [v[0], v[1]] as [number, number] }))
                  }
                  className="mt-4"
                />
              </FilterBlock>

              <FilterBlock label="Colore">
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <Chip
                      key={c}
                      active={filters.color.includes(c)}
                      onClick={() => setFilters((f) => ({ ...f, color: toggle(f.color, c) }))}
                    >
                      {c}
                    </Chip>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock label="Purezza">
                <div className="flex flex-wrap gap-2">
                  {CLARITIES.map((c) => (
                    <Chip
                      key={c}
                      active={filters.clarity.includes(c)}
                      onClick={() => setFilters((f) => ({ ...f, clarity: toggle(f.clarity, c) }))}
                    >
                      {c}
                    </Chip>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock label="Taglio">
                <div className="flex flex-wrap gap-2">
                  {CUTS.map((c) => (
                    <Chip
                      key={c.value}
                      active={filters.cut.includes(c.value)}
                      onClick={() => setFilters((f) => ({ ...f, cut: toggle(f.cut, c.value) }))}
                    >
                      {c.label}
                    </Chip>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock label="Certificato">
                <div className="flex flex-wrap gap-2">
                  {LABS.map((l) => (
                    <Chip
                      key={l}
                      active={filters.labs.includes(l)}
                      onClick={() => setFilters((f) => ({ ...f, labs: toggle(f.labs, l) }))}
                    >
                      {l}
                    </Chip>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock
                label={`Prezzo · ${formatEur(filters.price[0])} – ${formatEur(filters.price[1])}`}
              >
                <Slider
                  value={filters.price}
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={500}
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, price: [v[0], v[1]] as [number, number] }))
                  }
                  className="mt-4"
                />
              </FilterBlock>

              <FilterBlock label="Ordinamento">
                <Select
                  value={filters.sort}
                  onValueChange={(v) => setFilters((f) => ({ ...f, sort: v as NivodaSort }))}
                >
                  <SelectTrigger className="w-full rounded-full border-ink/15 bg-bone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_asc">Prezzo crescente</SelectItem>
                    <SelectItem value="price_desc">Prezzo decrescente</SelectItem>
                    <SelectItem value="carat_desc">Carati decrescenti</SelectItem>
                  </SelectContent>
                </Select>
              </FilterBlock>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-6">
              <button
                type="button"
                onClick={() => void run(filters, 0, false)}
                disabled={busy}
                className="btn-primary group inline-flex items-center gap-2 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Cerca
              </button>
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink/60 hover:text-gold-deep transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Azzera filtri
              </button>
              <p className="text-xs text-muted-foreground">
                La ricerca parte solo quando premi «Cerca».
              </p>
            </div>
          </div>

          {/* ── Risultati ── */}
          <div className="mt-12 md:mt-16">
            {status === "error" && (
              <div className="rounded-2xl border border-ink/12 bg-bone/60 p-10 text-center">
                <p className="font-display text-2xl text-ink">
                  Non siamo riusciti a caricare le pietre.
                </p>
                <p className="mt-3 text-muted-foreground">
                  Può capitare quando il catalogo del fornitore è momentaneamente occupato.
                </p>
                <button
                  type="button"
                  onClick={() => void run(appliedRef.current, 0, false)}
                  className="btn-primary mt-8"
                >
                  Riprova
                </button>
              </div>
            )}

            {status === "loading" && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-ink/10 overflow-hidden">
                    <div className="aspect-square animate-pulse bg-ink/5" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-2/3 animate-pulse rounded bg-ink/5" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-ink/5" />
                      <div className="h-4 w-1/3 animate-pulse rounded bg-ink/10" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {status !== "loading" && status !== "error" && items.length === 0 && (
              <div className="rounded-2xl border border-ink/12 bg-bone/60 p-10 text-center">
                <p className="font-display text-2xl text-ink">
                  Nessuna pietra corrisponde ai filtri selezionati
                </p>
                <p className="mt-3 text-muted-foreground">
                  Prova ad allargare la ricerca: più forme, un intervallo di carati più ampio o
                  una fascia di prezzo più estesa.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                    void run(DEFAULT_FILTERS, 0, false);
                  }}
                  className="btn-primary mt-8"
                >
                  Azzera filtri
                </button>
              </div>
            )}

            {status !== "loading" && status !== "error" && items.length > 0 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {items.map((d, i) => (
                    <DiamondCard key={`${d.diamondId ?? "x"}-${i}`} diamond={d} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-14 flex justify-center">
                    <button
                      type="button"
                      onClick={() => void run(appliedRef.current, page + 1, true)}
                      disabled={status === "loadingMore"}
                      className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                    >
                      {status === "loadingMore" && <Loader2 className="h-4 w-4 animate-spin" />}
                      Carica altri
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-ink/55 mb-3">{label}</p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs tracking-wide transition-all duration-300 ${
        active
          ? "border-gold-deep bg-gold-deep text-bone"
          : "border-ink/15 bg-bone/60 text-ink/70 hover:border-gold-deep/60 hover:text-ink"
      }`}
    >
      {active && <Check className="h-3 w-3" strokeWidth={3} />}
      {children}
    </button>
  );
}

function DiamondCard({ diamond }: { diamond: NivodaDiamond }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const go = () => {
    if (!diamond.diamondId) return;
    void navigate({
      to: "/crea-il-tuo-gioiello_/pietra/$diamondId",
      params: { diamondId: diamond.diamondId },
    });
  };

  return (
    <button
      type="button"
      onClick={go}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group text-left rounded-2xl border border-ink/12 bg-bone/50 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-gold-deep/60 hover:shadow-[0_18px_50px_-28px_oklch(0.58_0.085_60/0.6)]"
    >
      <div className="relative aspect-square bg-bone-deep/40 overflow-hidden">
        {diamond.image && (
          <img
            src={diamond.image}
            alt={`Diamante ${SHAPE_LABELS[diamond.shape ?? ""] ?? diamond.shape ?? ""} ${formatCarats(diamond.carats)}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}
        {hover && diamond.video && (
          <iframe
            src={diamond.video}
            title="Video 360"
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay"
          />
        )}
      </div>
      <div className="p-5">
        <p className="font-display text-lg leading-tight text-ink">
          {SHAPE_LABELS[diamond.shape ?? ""] ?? diamond.shape ?? "—"} · {formatCarats(diamond.carats)}
        </p>
        <p className="mt-1 text-sm text-ink/70">
          Colore {diamond.color ?? "—"} · Purezza {diamond.clarity ?? "—"}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/45">
          Taglio {diamond.cutLabel ?? "—"} · {diamond.lab ?? "—"}
        </p>
        <p className="mt-4 font-display text-xl text-gold-deep">{formatEur(diamond.priceEur)}</p>
      </div>
    </button>
  );
}
