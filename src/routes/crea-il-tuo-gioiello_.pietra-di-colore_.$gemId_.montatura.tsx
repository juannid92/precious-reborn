import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Gem } from "lucide-react";
import { MediaPietraNivoda } from "@/components/MediaPietraNivoda";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { getNivodaGemstone } from "@/lib/gemstones.functions";
import type { Gemstone } from "@/lib/gemstones-types";
import { getMontature, getConfigSito, inviaRichiesta } from "@/lib/montature.functions";
import type { Montatura } from "@/lib/montature.server";

export const Route = createFileRoute(
  "/crea-il-tuo-gioiello_/pietra-di-colore_/$gemId_/montatura",
)({
  validateSearch: ((search: Record<string, unknown>) => ({
    gioiello: typeof search.gioiello === "string" ? search.gioiello : "",
    montatura: typeof search.montatura === "string" ? search.montatura : "",
    metallo: typeof search.metallo === "string" ? search.metallo : "",
    misura: typeof search.misura === "string" ? search.misura : "",
    passo: typeof search.passo === "string" ? search.passo : "",
  })) as (search: Record<string, unknown>) => {
    gioiello?: string;
    montatura?: string;
    metallo?: string;
    misura?: string;
    passo?: string;
  },
  head: () => ({
    meta: [
      { title: "Progetta il tuo gioiello · Cara Preziosi" },
      {
        name: "description",
        content:
          "Scegli la montatura, il metallo e la misura per creare il tuo gioiello personalizzato con il maestro orafo Nicola Caradonna.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: MontaturaGemmaPage,
});

const STEP_LABELS = ["Tipo", "Montatura", "Dettagli", "Riepilogo"];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function MontaturaGemmaPage() {
  const { gemId } = Route.useParams();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const passo = Number(search.passo) || 1;

  const [item, setItem] = useState<Gemstone | null>(null);
  const [stoneStatus, setStoneStatus] = useState<"loading" | "ready" | "error">("loading");
  const [montature, setMontature] = useState<Montatura[]>([]);
  const [montatureStatus, setMontatureStatus] = useState<"loading" | "ready">("loading");
  const [whatsappNum, setWhatsappNum] = useState<string | null>(null);

  const fetchGem = useServerFn(getNivodaGemstone);
  const fetchMontature = useServerFn(getMontature);
  const fetchConfig = useServerFn(getConfigSito);

  useEffect(() => {
    let alive = true;
    setStoneStatus("loading");
    fetchGem({ data: { gemId } })
      .then((res) => {
        if (!alive) return;
        setItem(res.item);
        setStoneStatus(res.item ? "ready" : "error");
      })
      .catch((err) => {
        console.error("[montatura-gemma] errore caricamento pietra:", err);
        if (alive) setStoneStatus("error");
      });
    return () => { alive = false; };
  }, [gemId, fetchGem]);

  useEffect(() => {
    fetchConfig({ data: undefined }).then((cfg) => {
      const num = cfg.whatsapp?.replace(/\D/g, "") ?? null;
      setWhatsappNum(num && num !== "NUMERO_WHATSAPP" ? num : null);
    }).catch((err) => {
      console.error("[montatura-gemma] errore caricamento config:", err);
    });
  }, [fetchConfig]);

  useEffect(() => {
    if (!item?.shape) return;
    fetchMontature({ data: { forma: item.shape } })
      .then((m) => setMontature(m))
      .catch((err) => {
        console.error("[montatura-gemma] errore caricamento montature:", err);
        setMontature([]);
      });
  }, [item?.shape, fetchMontature]);

  const categorie = useMemo(
    () => [...new Set(montature.map((m) => m.categoria))].sort(),
    [montature],
  );

  const title = item?.title ?? item?.gemLabel ?? "Pietra certificata";
  const gioiello = search.gioiello ?? "";
  const montaturaCodice = search.montatura ?? "";
  const metallo = search.metallo ?? "";
  const misura = search.misura ?? "";

  const montaturaSel = useMemo(
    () => montature.find((m) => m.codice === montaturaCodice) ?? null,
    [montature, montaturaCodice],
  );

  const metalliDisp = montaturaSel?.metalli ?? [];
  const categorieFiltrate = useMemo(
    () => categorie.filter((c) => montature.some((m) => m.categoria === c)),
    [categorie, montature],
  );

  const goTo = (step: number) => {
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: (prev) => ({ ...prev, passo: String(step) }),
    });
  };

  const goNext = () => { if (passo < 4) goTo(passo + 1); };
  const goPrev = () => { if (passo > 1) goTo(passo - 1); };

  const setGioiello = (val: string) => {
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: (prev) => ({ ...prev, gioiello: val, montatura: "", metallo: "", passo: "2" }),
    });
  };

  const setMontatura_ = (codice: string) => {
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: (prev) => ({ ...prev, montatura: codice, metallo: "", passo: "3" }),
    });
  };

  const setMetallo_ = (val: string) => {
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: (prev) => ({ ...prev, metallo: val }),
    });
  };

  const setMisura_ = (val: string) => {
    void navigate({
      to: "/crea-il-tuo-gioiello/pietra-di-colore/$gemId/montatura",
      params: { gemId },
      search: (prev) => ({ ...prev, misura: val }),
    });
  };

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
        pietra_tipo: "gemma",
        pietra_id: gemId,
        pietra_titolo: title,
        gioiello,
        montatura_codice: montaturaCodice,
        metallo,
        misura,
        note,
        canale: "sito",
      },
    });
    if (res.id) {
      setStoneStatus("ready");
      goTo(5);
    }
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
        pietra_tipo: "gemma",
        pietra_id: gemId,
        pietra_titolo: title,
        gioiello,
        montatura_codice: montaturaCodice,
        metallo,
        misura,
        note,
        canale: "whatsapp",
      },
    });

    const righe = [
      "Richiesta di progetto dal sito",
      "",
      `Pietra: ${title}`,
      `Codice pietra: ${gemId}`,
      `Gioiello: ${gioiello}`,
      `Montatura: ${montaturaSel?.nome ?? ""}`,
      `Metallo: ${capitalize(metallo)}`,
    ];
    if (misura) righe.push(`Misura: ${misura}`);
    if (note) righe.push(`Note: ${note}`);
    righe.push("");
    righe.push(`Nome: ${nome}`);
    righe.push(`Contatti: ${email}${telefono ? ` · ${telefono}` : ""}`);
    righe.push("");
    righe.push(`Pagina della pietra: ${window.location.origin}/crea-il-tuo-gioiello/pietra-di-colore/${gemId}`);
    const msg = righe.filter((r) => r !== "").join("\n");
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const StonePreview = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full aspect-square max-w-[280px] rounded-2xl border border-gold-deep/30 bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
        <div className="w-[70%] aspect-square">
          <MediaPietraNivoda image={item?.image ?? null} video={item?.video ?? null} alt={title} interattivo={false} />
        </div>
      </div>
      {montaturaSel && (
        <p className="text-center text-sm text-bone/70">
          {montaturaSel.nome}
          {metallo && <>, {capitalize(metallo)}</>}
        </p>
      )}
    </div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-12">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = passo === n;
        const done = passo > n;
        return (
          <div key={label} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { if (done || active) goTo(n); }}
              disabled={!done && !active}
              className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold transition-all ${
                active
                  ? "bg-gold-deep text-bone shadow-md"
                  : done
                    ? "bg-gold-deep/20 text-gold-deep cursor-pointer hover:bg-gold-deep/30"
                    : "bg-white/5 text-bone/30"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </button>
            <span className={`hidden sm:inline text-xs uppercase tracking-[0.2em] ${active ? "text-gold-deep" : "text-bone/40"}`}>
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-8 h-px ${passo > n ? "bg-gold-deep/40" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

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
            <Link to="/crea-il-tuo-gioiello/pietra-di-colore" className="btn-primary mt-8 inline-flex">
              Torna al catalogo
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (passo === 5) {
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
            <Link to="/crea-il-tuo-gioiello/pietra-di-colore" className="btn-primary inline-flex">
              Continua a esplorare
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-obsidian text-bone min-h-screen">
      <section className="pt-36 md:pt-44 pb-24 md:pb-36">
        <div className="container-cara">
          <Link
            to="/crea-il-tuo-gioiello/pietra-di-colore/$gemId"
            params={{ gemId }}
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

          <StepIndicator />

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              {passo === 1 && (
                <div>
                  <h2 className="font-display text-2xl mb-2">Che tipo di gioiello desideri?</h2>
                  <p className="text-bone/60 mb-8">Scegli la famiglia di gioiello per iniziare a progettare.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categorieFiltrate.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setGioiello(cat)}
                        className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left hover:border-gold-deep/50 hover:bg-gold-deep/5 transition-all"
                      >
                        <Gem className="h-6 w-6 text-gold-deep mb-3" />
                        <p className="font-display text-lg">{capitalize(cat)}</p>
                      </button>
                    ))}
                    {categorieFiltrate.length === 0 && (
                      <p className="text-bone/40 text-sm col-span-full">
                        Nessuna montatura compatibile con questa pietra al momento.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {passo === 2 && (
                <div>
                  <h2 className="font-display text-2xl mb-2">Scegli la montatura</h2>
                  <p className="text-bone/60 mb-8">
                    {montature.filter((m) => m.categoria === gioiello).length} montature disponibili per {capitalize(gioiello)}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {montature
                      .filter((m) => m.categoria === gioiello)
                      .map((m) => (
                        <button
                          key={m.codice}
                          type="button"
                          onClick={() => setMontatura_(m.codice)}
                          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left hover:border-gold-deep/50 hover:bg-gold-deep/5 transition-all"
                        >
                          {m.immagine ? (
                            <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-white/5">
                              <img src={m.immagine} alt={m.nome} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          ) : (
                            <div className="aspect-[4/3] rounded-xl mb-4 bg-[#111] border border-white/5 flex items-center justify-center">
                              <span className="text-bone/25 text-xs uppercase tracking-widest">{m.nome}</span>
                            </div>
                          )}
                          <p className="font-display text-lg mb-1">{m.nome}</p>
                          {m.descrizione && (
                            <p className="text-bone/50 text-sm leading-relaxed line-clamp-2">{m.descrizione}</p>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {passo === 3 && (
                <div>
                  <h2 className="font-display text-2xl mb-8">Dettagli personalizzazione</h2>
                  <div className="space-y-10">
                    <div>
                      <p className="eyebrow text-gold-deep mb-4">Metallo</p>
                      <div className="flex flex-wrap gap-3">
                        {metalliDisp.map((met) => (
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
                          <dd className="text-bone text-right">{capitalize(gioiello)}</dd>
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
                        (passo === 2 && !montaturaCodice) ||
                        (passo === 3 && !metallo)
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
