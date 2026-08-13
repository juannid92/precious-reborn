import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, RotateCcw, Search } from "lucide-react";
import { MediaPietraNivoda } from "@/components/MediaPietraNivoda";

import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
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
  PAGE_SIZE,
  SEARCH_COOLDOWN_SECONDS,
  SHAPE_OPTIONS,
  type NivodaDiamond,
  type NivodaSort,
} from "@/lib/nivoda-types";

export const Route = createFileRoute("/crea-il-tuo-gioiello_/pietra")({
  head: () => ({
    meta: [
      { title: "Scegli la tua pietra · Cara Preziosi" },
      {
        name: "description",
        content:
          "Seleziona la pietra certificata del tuo gioiello su misura: forma, carati, colore e purezza. Selezione dell'atelier Cara Preziosi a Bari.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Scegli la tua pietra · Cara Preziosi" },
      {
        property: "og:description",
        content:
          "Pietre certificate selezionate singolarmente, disponibili presso l'atelier Cara Preziosi di Bari.",
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
  caratFrom: number;
  caratTo: number;
  sort: NivodaSort;
};

const DEFAULT_FILTERS: Filters = {
  shapes: [],
  color: [],
  clarity: [],
  caratFrom: CARAT_MIN,
  caratTo: CARAT_MAX,
  sort: "carat_asc",
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function buildBody(f: Filters, page: number) {
  const body: Record<string, unknown> = {
    caratFrom: f.caratFrom,
    caratTo: f.caratTo,
    sort: f.sort,
    page,
    pageSize: PAGE_SIZE,
  };
  if (f.shapes.length) body.shapes = f.shapes;
  if (f.color.length) body.color = f.color;
  if (f.clarity.length) body.clarity = f.clarity;
  return body;
}

function PietraPage() {
  const search = useServerFn(searchNivodaDiamonds);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [items, setItems] = useState<NivodaDiamond[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "loadingMore" | "error">("loading");
  const [cooldown, setCooldown] = useState(0);

  // filtri effettivamente applicati all'ultima ricerca
  const appliedRef = useRef<Filters>(DEFAULT_FILTERS);
  const firstLoad = useRef(true);

  // Conto alla rovescia fra due richieste consecutive al fornitore.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const run = useCallback(
    async (f: Filters, nextPage: number, append: boolean) => {
      setStatus(append ? "loadingMore" : "loading");
      setCooldown(SEARCH_COOLDOWN_SECONDS);
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

  const loading = status === "loading";
  const blocked = loading || status === "loadingMore" || cooldown > 0;

  const searchLabel = loading ? "Ricerca…" : cooldown > 0 ? `Attendi ${cooldown}s` : "Cerca";

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
          <PageBreadcrumb current="Scegli la tua pietra" className="mb-8" />
          <p className="eyebrow text-gold-deep mb-6">Primo passo · La pietra</p>
          <h1
            className="font-display leading-[1] text-ink max-w-[16ch]"
            style={{ fontSize: "clamp(2.3rem, 5vw, 4.5rem)" }}
          >
            Scegli la tua<span className="italic text-gold-deep"> pietra.</span>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Ogni pietra è selezionata singolarmente e certificata. Il prezzo viene definito
            insieme a te in base alla creazione che sceglierai: contattaci per un preventivo
            dedicato.
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
                  {SHAPE_OPTIONS.map((s) => (
                    <Chip
                      key={s.value}
                      active={filters.shapes.includes(s.value)}
                      onClick={() =>
                        setFilters((f) => ({ ...f, shapes: toggle(f.shapes, s.value) }))
                      }
                    >
                      {s.label}
                    </Chip>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock label="Carati">
                <div className="flex flex-wrap items-end gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-ink/55">Da</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={50}
                      step={0.1}
                      value={filters.caratFrom}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, caratFrom: Number(e.target.value) }))
                      }
                      className="w-28 rounded-full border border-ink/15 bg-bone px-4 py-2 text-sm text-ink outline-none focus:border-gold-deep"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-ink/55">A</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={50}
                      step={0.1}
                      value={filters.caratTo}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, caratTo: Number(e.target.value) }))
                      }
                      className="w-28 rounded-full border border-ink/15 bg-bone px-4 py-2 text-sm text-ink outline-none focus:border-gold-deep"
                    />
                  </label>
                </div>
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

              <FilterBlock label="Ordina per">
                <Select
                  value={filters.sort}
                  onValueChange={(v) => setFilters((f) => ({ ...f, sort: v as NivodaSort }))}
                >
                  <SelectTrigger className="w-full rounded-full border-ink/15 bg-bone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carat_asc">Carati crescenti</SelectItem>
                    <SelectItem value="carat_desc">Carati decrescenti</SelectItem>
                  </SelectContent>
                </Select>
              </FilterBlock>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-6">
              <button
                type="button"
                onClick={() => void run(filters, 0, false)}
                disabled={blocked}
                className="btn-primary group inline-flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {searchLabel}
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
                  Catalogo pietre momentaneamente non disponibile. Riprova tra qualche istante.
                </p>
                <button
                  type="button"
                  onClick={() => void run(appliedRef.current, 0, false)}
                  disabled={cooldown > 0}
                  className="btn-primary mt-8 disabled:opacity-60"
                >
                  {cooldown > 0 ? `Attendi ${cooldown}s` : "Riprova"}
                </button>
              </div>
            )}

            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
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

            {!loading && status !== "error" && items.length === 0 && (
              <div className="rounded-2xl border border-ink/12 bg-bone/60 p-10 text-center">
                <p className="font-display text-2xl text-ink">
                  Nessuna pietra corrisponde ai criteri scelti. Prova ad ampliare la ricerca.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                    void run(DEFAULT_FILTERS, 0, false);
                  }}
                  disabled={cooldown > 0}
                  className="btn-primary mt-8 disabled:opacity-60"
                >
                  {cooldown > 0 ? `Attendi ${cooldown}s` : "Azzera filtri"}
                </button>
              </div>
            )}

            {!loading && status !== "error" && items.length > 0 && (
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
                      disabled={blocked}
                      className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                    >
                      {status === "loadingMore" && <Loader2 className="h-4 w-4 animate-spin" />}
                      {status === "loadingMore"
                        ? "Caricamento…"
                        : cooldown > 0
                          ? `Attendi ${cooldown}s`
                          : "Carica altre pietre"}
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

  const title = diamond.title ?? diamond.shapeLabel ?? "Pietra certificata";

  const specLine = [
    diamond.measurements,
    diamond.tablePct ? `Tavola ${diamond.tablePct}` : null,
    diamond.depthPct ? `Prof. ${diamond.depthPct}` : null,
  ].filter((v): v is string => Boolean(v));

  const tags = [
    diamond.eyeClean === "Sì" || diamond.eyeClean === "Si" ? "Pulita a occhio nudo" : null,
    diamond.luster === "Eccellente" ? "Lucentezza eccellente" : null,
    diamond.shade === "Nessuna" ? "Nessuna sfumatura" : null,
  ]
    .filter((v): v is string => Boolean(v))
    .slice(0, 3);


  const go = () => {
    if (!diamond.diamondId) return;
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra/$diamondId",
      params: { diamondId: diamond.diamondId },
    });
  };

  return (
    <article
      onClick={go}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group flex cursor-pointer flex-col rounded-2xl border border-ink/12 bg-bone/50 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-gold-deep/60 hover:shadow-[0_18px_50px_-28px_oklch(0.58_0.085_60/0.6)]"
    >
      <div className="relative aspect-square overflow-hidden bg-bone-deep/40">
        <MediaPietraNivoda 
          image={diamond.image} 
          video={diamond.video} 
          alt={title} 
        />
        <div className="absolute inset-0 z-20" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-lg font-semibold leading-tight text-ink">{title}</p>
        {specLine.length > 0 && (
          <p className="mt-1.5 text-[11px] text-ink/55">{specLine.join(" · ")}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-ink/10 bg-ink/[0.04] px-2.5 py-1 text-[10px] tracking-wide text-ink/55"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {diamond.lab && diamond.certNumber && (
          <p className="mt-2.5 text-xs uppercase tracking-[0.18em] text-ink/45">
            Certificato {diamond.lab} {diamond.certNumber}
          </p>
        )}

        <button type="button" onClick={go} className="btn-primary mt-5 self-start">
          Scopri questa pietra
        </button>
      </div>
    </article>
  );
}
