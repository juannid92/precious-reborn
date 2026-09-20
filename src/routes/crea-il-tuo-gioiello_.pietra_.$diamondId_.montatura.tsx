import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Gem, Settings, Palette, Ruler, FileText } from "lucide-react";
import { MediaPietraNivoda } from "@/components/MediaPietraNivoda";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { getNivodaDiamond } from "@/lib/nivoda.functions";
import { type NivodaDiamond } from "@/lib/nivoda-types";
import { getMontature, getConfigSito, inviaRichiesta } from "@/lib/montature.functions";
import type { Montatura } from "@/lib/montature.server";

export const Route = createFileRoute(
  "/crea-il-tuo-gioiello_/pietra_/$diamondId_/montatura",
)({
  validateSearch: ((search: Record<string, unknown>) => ({
    gioiello: typeof search.gioiello === "string" ? search.gioiello : "",
    montatura: typeof search.montatura === "string" ? search.montatura : "",
    metallo: typeof search.metallo === "string" ? search.metallo : "",
    misura: typeof search.misura === "string" ? search.misura : "",
    passo: typeof search.passo === "string" ? search.passo : "1",
    config: typeof search.config === "string" ? search.config : "",
  })) as (search: Record<string, unknown>) => {
    gioiello?: string;
    montatura?: string;
    metallo?: string;
    misura?: string;
    passo?: string;
    config?: string;
  },
  head: () => ({
    meta: [
      { title: "Progetta il tuo anello · Cara Preziosi" },
      {
        name: "description",
        content:
          "Scegli la montatura, il metallo e la misura per creare il tuo gioiello personalizzato con il maestro orafo Nicola Caradonna.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: MontaturaPietraPage,
});

// ─── CONFIGURAZIONE ────────────────────────────────────────────────────────

export type Configurazione = {
  version: 1;
  headType: string | null;
  headStoneType: string | null;
  shankType: string | null;
  peekaboo: string | null;
  sideSetting: string | null;
  sideStoneType: string | null;
  sideStoneLength: string | null;
  carvingType: string | null;
  metalType: string | null;
  metalQuality: string | null;
  headMetalColor: string | null;
  shankMetalColor: string | null;
  engravingText: string;
  ringSizeSystem: string | null;
  ringSize: string | null;
};

export const DEFAULT_CONFIG: Configurazione = {
  version: 1,
  headType: "four_prongs",
  headStoneType: null,
  shankType: "single",
  peekaboo: "none",
  sideSetting: "none",
  sideStoneType: null,
  sideStoneLength: null,
  carvingType: "plain",
  metalType: "gold",
  metalQuality: "KT_18",
  headMetalColor: "yellow_gold",
  shankMetalColor: "yellow_gold",
  engravingText: "",
  ringSizeSystem: "UK",
  ringSize: "",
};

export function parseConfig(raw: string | undefined | null): Configurazione {
  if (!raw) return { ...DEFAULT_CONFIG };
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return { ...DEFAULT_CONFIG, ...parsed } as Configurazione;
    }
    return { ...DEFAULT_CONFIG };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function serializeConfig(config: Configurazione): string {
  return JSON.stringify(config);
}

// ─── COSTANTI UI ───────────────────────────────────────────────────────────

const STEP_LABELS = ["Tipo", "Montatura", "Personalizza", "Materiali", "Riepilogo", "Conferma"];

function capitalize(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CATEGORIE: { valore: string; etichetta: string }[] = [
  { valore: "anello", etichetta: "Anello" },
  { valore: "veretta", etichetta: "Veretta" },
  { valore: "pendente", etichetta: "Pendente" },
  { valore: "orecchini", etichetta: "Orecchini" },
];

// ─── STEP INDICATOR ────────────────────────────────────────────────────────

function StepIndicator({ passo }: { passo: number }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center gap-2 mb-14">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = passo === n;
        const done = passo > n;
        return (
          <div key={label} className="flex items-center">
            <button
              type="button"
              onClick={() => {
                if (done || active) {
                  void navigate({
                    to: "/crea-il-tuo-gioiello/pietra/$diamondId/montatura",
                    params: { diamondId: Route.useParams().diamondId },
                    search: (prev) => ({ ...prev, passo: String(n) }),
                  });
                }
              }}
              disabled={!done && !active}
              aria-pressed={active}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
                active
                  ? "bg-gold-deep text-bone shadow-md"
                  : done
                    ? "bg-gold-deep/20 text-gold-deep cursor-pointer hover:bg-gold-deep/30"
                    : "bg-white/5 text-bone/30"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </button>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-6 h-px mx-1 ${
                passo > n ? "bg-gold-deep/40" : "bg-white/10"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── CARD MONTATURA ────────────────────────────────────────────────────────

function MontaturaCard({
  montatura,
  selected,
  stoneCarats,
  onClick,
}: {
  montatura: Montatura;
  selected: boolean;
  stoneCarats: number | null;
  onClick: () => void;
}) {
  const outOfRange =
    stoneCarats !== null &&
    montatura.carati_min !== null &&
    montatura.carati_max !== null &&
    (stoneCarats < montatura.carati_min || stoneCarats > montatura.carati_max);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full text-left rounded-2xl border-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
        selected
          ? "border-gold-deep bg-gold-deep/5"
          : "border-white/10 bg-white/[0.03] hover:border-gold-deep/40 hover:bg-gold-deep/5"
      }`}
    >
      {montatura.immagine ? (
        <div className="aspect-[4/3] rounded-t-xl overflow-hidden">
          <img
            src={montatura.immagine}
            alt={montatura.nome}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] rounded-t-xl bg-[#0a0a0a] border-b border-white/5 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gold-deep/30 flex items-center justify-center">
            <Gem className="h-4 w-4 text-gold-deep/40" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-bone/20">
            Immagine in preparazione
          </p>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-display text-lg leading-tight">{montatura.nome}</p>
          {selected && (
            <div className="shrink-0 w-5 h-5 rounded-full bg-gold-deep flex items-center justify-center">
              <Check className="h-3 w-3 text-bone" />
            </div>
          )}
        </div>

        {montatura.descrizione && (
          <p className="text-bone/50 text-sm leading-relaxed mb-3 line-clamp-2">
            {montatura.descrizione}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {montatura.metalli.map((m) => (
            <span
              key={m}
              className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/10 text-bone/60"
            >
              {capitalize(m)}
            </span>
          ))}
        </div>

        {montatura.carati_min !== null && montatura.carati_max !== null && (
          <p className="text-[10px] text-bone/35">
            {montatura.carati_min}–{montatura.carati_max} ct
          </p>
        )}

        {outOfRange && (
          <p className="mt-2 text-[10px] text-amber-400/80 italic">
            Compatibilità da verificare con il gioielliere
          </p>
        )}
      </div>
    </button>
  );
}

// ─── CATEGORIA CARD ────────────────────────────────────────────────────────

function CategoriaCard({
  valore,
  etichetta,
  selected,
  onClick,
}: {
  valore: string;
  etichetta: string;
  selected: boolean;
  onClick: () => void;
}) {
  const icons: Record<string, React.ReactNode> = {
    anello: <Gem className="h-7 w-7" />,
    veretta: <Settings className="h-7 w-7" />,
    pendente: <Palette className="h-7 w-7" />,
    orecchini: <Gem className="h-7 w-7" />,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex flex-col items-center gap-4 rounded-2xl border-2 p-8 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
        selected
          ? "border-gold-deep bg-gold-deep/5"
          : "border-white/10 bg-white/[0.03] hover:border-gold-deep/40 hover:bg-gold-deep/5"
      }`}
    >
      <div
        className={`transition-colors ${
          selected ? "text-gold-deep" : "text-bone/40 group-hover:text-gold-deep/70"
        }`}
      >
        {icons[valore] ?? <Gem className="h-7 w-7" />}
      </div>
      <div className="text-center">
        <p className={`font-display text-xl transition-colors ${
          selected ? "text-gold-deep" : "text-bone/80 group-hover:text-bone"
        }`}>
          {etichetta}
        </p>
      </div>
      {selected && (
        <div className="w-2 h-2 rounded-full bg-gold-deep" />
      )}
    </button>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

function MontaturaPietraPage() {
  const { diamondId } = Route.useParams();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const passo = Number(search.passo) || 1;

  const [item, setItem] = useState<NivodaDiamond | null>(null);
  const [stoneStatus, setStoneStatus] = useState<"loading" | "ready" | "error">("loading");
  const [montature, setMontature] = useState<Montatura[]>([]);
  const [montatureStatus, setMontatureStatus] = useState<"loading" | "ready">("loading");
  const [whatsappNum, setWhatsappNum] = useState<string | null>(null);

  const fetchDiamond = useServerFn(getNivodaDiamond);
  const fetchMontature = useServerFn(getMontature);
  const fetchConfig = useServerFn(getConfigSito);

  const config = useMemo(() => parseConfig(search.config), [search.config]);

  useEffect(() => {
    let alive = true;
    setStoneStatus("loading");
    fetchDiamond({ data: { diamondId } })
      .then((res) => {
        if (!alive) return;
        setItem(res.item);
        setStoneStatus(res.item ? "ready" : "error");
      })
      .catch(() => {
        if (alive) setStoneStatus("error");
      });
    return () => { alive = false; };
  }, [diamondId, fetchDiamond]);

  useEffect(() => {
    fetchConfig({ data: undefined })
      .then((cfg) => {
        const num = cfg.whatsapp?.replace(/\D/g, "") ?? null;
        setWhatsappNum(num && num !== "NUMERO_WHATSAPP" ? num : null);
      })
      .catch(() => {});
  }, [fetchConfig]);

  useEffect(() => {
    if (!item?.shape) return;
    setMontatureStatus("loading");
    fetchMontature({ data: { forma: item.shape } })
      .then((m) => { setMontature(m); setMontatureStatus("ready"); })
      .catch(() => { setMontature([]); setMontatureStatus("ready"); });
  }, [item?.shape, fetchMontature]);

  const categorieDisponibili = useMemo(
    () => [...new Set(montature.map((m) => m.categoria))].sort(),
    [montature],
  );

  const title = item?.title ?? item?.shapeLabel ?? "Pietra certificata";
  const gioiello = search.gioiello;
  const montaturaCodice = search.montatura;
  const metallo = search.metallo;
  const misura = search.misura;

  const montaturaSel = useMemo(
    () => montature.find((m) => m.codice === montaturaCodice) ?? null,
    [montature, montaturaCodice],
  );

  const stoneCarats = item?.carats ?? null;

  // ─── NAVIGAZIONE PASSI ──────────────────────────────────────────────────

  const goTo = (step: number) => {
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra/$diamondId/montatura",
      params: { diamondId },
      search: (prev) => ({ ...prev, passo: String(step) }),
    });
  };
  const goNext = () => { if (passo < 6) goTo(passo + 1); };
  const goPrev = () => { if (passo > 1) goTo(passo - 1); };

  const setGioiello = (val: string) => {
    const newConfig = serializeConfig({ ...config });
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra/$diamondId/montatura",
      params: { diamondId },
      search: { ...search, gioiello: val, montatura: "", metallo: "", passo: "2", config: newConfig },
    });
  };

  const setMontatura_ = (codice: string) => {
    const newConfig = serializeConfig({ ...config });
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra/$diamondId/montatura",
      params: { diamondId },
      search: { ...search, montatura: codice, metallo: "", passo: "3", config: newConfig },
    });
  };

  const setMetallo_ = (val: string) => {
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra/$diamondId/montatura",
      params: { diamondId },
      search: { ...prev, metallo: val },
    });
  };

  const setMisura_ = (val: string) => {
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra/$diamondId/montatura",
      params: { diamondId },
      search: { ...prev, misura: val },
    });
  };

  // ─── INVIO RICHIESTA ───────────────────────────────────────────────────

  const handleInvia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nome = String(fd.get("nome") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const telefono = String(fd.get("telefono") ?? "").trim();
    const note = String(fd.get("note") ?? "").trim();
    if (!nome || !email) return;
    const res = await inviaRichiesta({
      data: {
        cliente_nome: nome,
        cliente_email: email,
        cliente_telefono: telefono,
        pietra_tipo: "diamante",
        pietra_id: diamondId,
        pietra_titolo: title,
        gioiello: gioiello ?? "",
        montatura_codice: montaturaCodice ?? "",
        metallo: metallo ?? "",
        misura: misura ?? "",
        note,
        canale: " sito",
        configurazione: { ...DEFAULT_CONFIG },
        riepilogo_configurazione: null,
        immagine_pietra: item?.image ?? null,
        immagine_montatura: montaturaSel?.immagine ?? null,
      },
    });
    if (res.id) goTo(6);
  };

  const handleWhatsApp = async () => {
    if (!whatsappNum) return;
    const form = document.getElementById("form-riepilogo") as HTMLFormElement | null;
    if (form) form.requestSubmit();
    const fd = form ? new FormData(form) : new FormData();
    const nome = String(fd.get("nome") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const telefono = String(fd.get("telefono") ?? "").trim();
    const note = String(fd.get("note") ?? "").trim();
    if (!nome || !email) return;
    await inviaRichiesta({
      data: {
        cliente_nome: nome,
        cliente_email: email,
        cliente_telefono: telefono,
        pietra_tipo: "diamante",
        pietra_id: diamondId,
        pietra_titolo: title,
        gioiello: gioiello ?? "",
        montatura_codice: montaturaCodice ?? "",
        metallo: metallo ?? "",
        misura: misura ?? "",
        note,
        canale: "whatsapp",
        configurazione: { ...DEFAULT_CONFIG },
        riepilogo_configurazione: null,
        immagine_pietra: item?.image ?? null,
        immagine_montatura: montaturaSel?.immagine ?? null,
      },
    });
    const righe = [
      "Richiesta di progetto dal sito",
      "",
      `Pietra: ${title}`,
      `Codice pietra: ${diamondId}`,
      `Gioiello: ${capitalize(gioiello ?? "—")}`,
      `Montatura: ${montaturaSel?.nome ?? "—"}`,
      `Metallo: ${capitalize(metallo ?? "—")}`,
    ];
    if (misura) righe.push(`Misura: ${misura}`);
    if (note) righe.push(`Note: ${note}`);
    righe.push("", `Nome: ${nome}`, `Contatti: ${email}${telefono ? ` · ${telefono}` : ""}`, "",
      `Pagina della pietra: ${window.location.origin}/crea-il-tuo-gioiello/pietra/${diamondId}`);
    const msg = righe.filter((r) => r !== "").join("\n");
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  // ─── PREVIEW PIETRA ────────────────────────────────────────────────────

  const StonePreview = () => (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-full aspect-square max-w-[300px] rounded-2xl border border-gold-deep/30 bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
        <div className="w-[72%] aspect-square">
          <MediaPietraNivoda
            image={item?.image ?? null}
            video={item?.video ?? null}
            alt={title}
            interattivo={false}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="font-display text-lg text-bone mb-1">{title}</p>
        {item?.shapeLabel && (
          <p className="text-[11px] uppercase tracking-[0.25em] text-bone/40">{item.shapeLabel}</p>
        )}
        {stoneCarats !== null && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-bone/30 mt-1">{stoneCarats} ct</p>
        )}
      </div>
      {montaturaSel && (
        <p className="text-center text-sm text-bone/60">
          {montaturaSel.nome}
          {metallo && <>, {capitalize(metallo)}</>}
        </p>
      )}
    </div>
  );

  // ─── STATI DI CARICAMENTO ──────────────────────────────────────────────

  if (stoneStatus === "loading") {
    return (
      <main className="bg-obsidian text-bone min-h-screen">
        <section className="pt-36 md:pt-44 pb-24 md:pb-36">
          <div className="container-cara">
            <div className="flex items-center gap-3 text-bone/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento…
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (stoneStatus === "error" || !item) {
    return (
      <main className="bg-obsidian text-bone min-h-screen">
        <section className="pt-36 md:pt-44 pb-24 md:pb-36">
          <div className="container-cara text-center">
            <p className="font-display text-2xl mb-4">
              Configuratore momentaneamente non disponibile. Riprova tra qualche istante.
            </p>
            <Link to="/crea-il-tuo-gioiello/pietra" className="btn-primary mt-8 inline-flex">
              Torna al catalogo
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (passo === 6) {
    return (
      <main className="bg-obsidian text-bone min-h-screen">
        <section className="pt-36 md:pt-44 pb-24 md:pb-36">
          <div className="container-cara max-w-xl text-center">
            <div className="w-16 h-16 rounded-full bg-gold-deep/20 flex items-center justify-center mx-auto mb-8">
              <Check className="h-8 w-8 text-gold-deep" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl mb-6">Richiesta ricevuta</h1>
            <p className="text-bone/70 text-lg leading-relaxed mb-4">
              Grazie, {title}. Il maestro orafo Nicola Caradonna analizzerà la tua richiesta e ti contatterà per definire insieme i dettagli del progetto.
            </p>
            <p className="text-bone/50 text-sm mb-12">
              Nessuna fretta: ogni gioiello viene studiato con cura prima di ogni proposta.
            </p>
            <Link to="/crea-il-tuo-gioiello/pietra" className="btn-primary inline-flex">
              Continua a esplorare
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ─── LAYOUT PRINCIPALE ─────────────────────────────────────────────────

  const montaturaFiltrate = montature.filter((m) => m.categoria === gioiello);

  return (
    <main className="bg-obsidian text-bone min-h-screen">
      <section className="pt-36 md:pt-44 pb-24 md:pb-36">
        <div className="container-cara">
          <Link
            to="/crea-il-tuo-gioiello/pietra/$diamondId"
            params={{ diamondId }}
            className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-bone/50 hover:text-gold-deep transition-colors mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Torna alla pietra
          </Link>
          <PageBreadcrumb current="Progetta il tuo gioiello" className="mb-10" />

          <div className="mb-6">
            <p className="eyebrow text-gold-deep mb-3">Pietra selezionata</p>
            <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
          </div>

          <StepIndicator passo={passo} />

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* COLONNA PRINCIPALE */}
            <div className="lg:col-span-7">

              {/* ── PASSO 1: TIPO DI GIOIELLO ── */}
              {passo === 1 && (
                <div>
                  <h2 className="font-display text-2xl mb-2">Che tipo di gioiello desideri?</h2>
                  <p className="text-bone/60 mb-10">Scegli la famiglia di gioiello per iniziare a progettare.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categorieDisponibili.length > 0 ? (
                      CATEGORIE.filter((c) => categorieDisponibili.includes(c.valore)).map((cat) => (
                        <CategoriaCard
                          key={cat.valore}
                          valore={cat.valore}
                          etichetta={cat.etichetta}
                          selected={gioiello === cat.valore}
                          onClick={() => setGioiello(cat.valore)}
                        />
                      ))
                    ) : (
                      <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                        <p className="text-bone/70 text-sm leading-relaxed">
                          Per questa forma non abbiamo ancora montature a catalogo.{' '}
                          <Link to="/contatti" search={{ richiesta: "", pietra: "" }} className="text-gold-deep underline underline-offset-4 hover:text-gold-deep/80 transition-colors">
                            Scrivici e la realizziamo su misura.
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── PASSO 2: MONTATURA ── */}
              {passo === 2 && (
                <div>
                  <h2 className="font-display text-2xl mb-2">Scegli la montatura</h2>
                  {montaturaFiltrate.length > 0 ? (
                    <>
                      <p className="text-bone/60 mb-8">
                        {montaturaFiltrate.length} montatura{montaturaFiltrate.length !== 1 ? "e" : ""} disponibili per {capitalize(gioiello ?? "")}.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {montaturaFiltrate.map((m) => (
                          <MontaturaCard
                            key={m.codice}
                            montatura={m}
                            selected={montaturaCodice === m.codice}
                            stoneCarats={stoneCarats}
                            onClick={() => setMontatura_(m.codice)}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                      <p className="text-bone/70 text-sm leading-relaxed">
                        Per questa forma non abbiamo ancora montature a catalogo.{' '}
                        <Link to="/contatti" search={{ richiesta: "", pietra: "" }} className="text-gold-deep underline underline-offset-4 hover:text-gold-deep/80 transition-colors">
                          Scrivici e la realizziamo su misura.
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── PASSO 3: PERSONALIZZAZIONE (temporaneo) ── */}
              {passo === 3 && (
                <div>
                  <h2 className="font-display text-2xl mb-8">Dettagli personalizzazione</h2>
                  <div className="space-y-10">
                    <div>
                      <p className="eyebrow text-gold-deep mb-4">Metallo</p>
                      <div className="flex flex-wrap gap-3">
                        {(montaturaSel?.metalli ?? []).map((met) => (
                          <button
                            key={met}
                            type="button"
                            onClick={() => setMetallo_(met)}
                            className={`rounded-full px-5 py-2.5 text-sm transition-all ${
                              metallo === met
                                ? "bg-gold-deep text-bone shadow-md"
                                : "border border-white/15 text-bone/70 hover:border-gold-deep/50 hover:text-bone"
                            }`}
                          >
                            {capitalize(met)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block">
                        <span className="eyebrow text-bone/50 block mb-3">Misura del dito (facoltativo)</span>
                        <input
                          type="text"
                          value={misura}
                          onChange={(e) => setMisura_(e.target.value)}
                          placeholder="es. 14, 15.5, M"
                          className="w-full max-w-xs bg-transparent border-b border-white/20 py-3 text-base text-bone placeholder:text-bone/25 focus:outline-none focus:border-gold-deep transition-colors"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block">
                        <span className="eyebrow text-bone/50 block mb-3">Note (facoltativo)</span>
                        <textarea
                          id="note"
                          rows={3}
                          placeholder="Descrivi eventuali preferenze, ispirazioni o richieste particolari…"
                          className="w-full bg-transparent border-b border-white/20 py-3 text-base text-bone placeholder:text-bone/25 focus:outline-none focus:border-gold-deep transition-colors resize-none"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASSO 4: RIEPILOGO (temporaneo) ── */}
              {passo === 4 && (
                <div>
                  <h2 className="font-display text-2xl mb-8">Riepilogo e invio</h2>
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                      <p className="eyebrow text-gold-deep mb-4">La tua configurazione</p>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-bone/50">Pietra</dt>
                          <dd className="text-bone text-right">{title}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-bone/50">Gioiello</dt>
                          <dd className="text-bone text-right">{capitalize(gioiello ?? "—")}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-bone/50">Montatura</dt>
                          <dd className="text-bone text-right">{montaturaSel?.nome ?? "—"}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-bone/50">Metallo</dt>
                          <dd className="text-bone text-right">{metallo ? capitalize(metallo) : "—"}</dd>
                        </div>
                        {misura && (
                          <div className="flex justify-between gap-4">
                            <dt className="text-bone/50">Misura</dt>
                            <dd className="text-bone text-right">{misura}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <form id="form-riepilogo" onSubmit={handleInvia} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <label className="block">
                          <span className="eyebrow text-bone/50 block mb-3">Nome<span className="text-gold-deep">*</span></span>
                          <input name="nome" type="text" required className="w-full bg-transparent border-b border-white/20 py-3 text-base text-bone focus:outline-none focus:border-gold-deep transition-colors" />
                        </label>
                        <label className="block">
                          <span className="eyebrow text-bone/50 block mb-3">Telefono</span>
                          <input name="telefono" type="tel" className="w-full bg-transparent border-b border-white/20 py-3 text-base text-bone focus:outline-none focus:border-gold-deep transition-colors" />
                        </label>
                      </div>
                      <label className="block">
                        <span className="eyebrow text-bone/50 block mb-3">Email<span className="text-gold-deep">*</span></span>
                        <input name="email" type="email" required className="w-full bg-transparent border-b border-white/20 py-3 text-base text-bone focus:outline-none focus:border-gold-deep transition-colors" />
                      </label>
                    </form>
                  </div>
                </div>
              )}

              {/* ── NAVIGAZIONE PASSI ── */}
              {passo > 1 && passo < 5 && (
                <div className="mt-12 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-bone/70 hover:border-gold-deep/50 hover:text-bone transition-all"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Indietro
                  </button>
                  {passo < 4 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={
                        (passo === 2 && !montaturaCodice)
                      }
                      className="btn-primary disabled:opacity-40"
                    >
                      Avanti
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-4">
                      <button type="submit" form="form-riepilogo" className="btn-primary">
                        Invia la richiesta
                      </button>
                      {whatsappNum && (
                        <button
                          type="button"
                          onClick={handleWhatsApp}
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-bone/70 hover:border-gold-deep/50 hover:text-bone transition-all"
                        >
                          Manda su WhatsApp
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* COLONNA PREVIEW */}
            {passo >= 2 && (
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <StonePreview />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
