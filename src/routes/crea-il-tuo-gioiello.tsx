import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowLeft, Sparkles, Circle, Gem, Heart, Star, Crown, Feather, CircleDot, Box, RotateCcw, Download, Loader2 } from "lucide-react";

import { brand, home } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { ImageUploadDropzone } from "@/components/atelier/ImageUploadDropzone";
import { SelectableCard } from "@/components/atelier/SelectableCard";
import { CreationStepper } from "@/components/atelier/CreationStepper";
import { ConceptPreviewPanel, type PreviewStage } from "@/components/atelier/ConceptPreviewPanel";
import { RequestSummaryCard } from "@/components/atelier/RequestSummaryCard";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
const Jewel3DViewer = lazy(() =>
  import("@/components/atelier/Jewel3DViewer").then((m) => ({ default: m.Jewel3DViewer })),
);
import { submitJewelConceptJob, pollJewelConceptJob } from "@/lib/jewel-concept.functions";
import { submitTrellis3DJob, pollTrellis3DJob } from "@/lib/jewel-3d.functions";

type Model3DStage = "idle" | "generating" | "ready" | "error" | "timeout_pending";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/crea-il-tuo-gioiello")({
  head: () => ({
    meta: [
      { title: "Crea il tuo gioiello — Gioiello Personalizzato con Configuratore 3D · Cara Preziosi" },
      {
        name: "description",
        content:
          "Progetta il tuo gioiello personalizzato con il configuratore 3D di Cara Preziosi. Un percorso su misura con il maestro orafo Nicola Caradonna.",
      },
      { property: "og:title", content: "Crea il tuo gioiello — Gioiello Personalizzato con Configuratore 3D · Cara Preziosi" },
      {
        property: "og:description",
        content:
          "Progetta il tuo gioiello personalizzato con il configuratore 3D di Cara Preziosi. Un percorso su misura con il maestro orafo Nicola Caradonna.",
      },
      { property: "og:url", content: "https://www.carapreziosi.it/crea-il-tuo-gioiello" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:image", content: "https://www.carapreziosi.it/brand/cara-preziosi-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Crea il tuo gioiello — Gioiello Personalizzato con Configuratore 3D · Cara Preziosi" },
      {
        name: "twitter:description",
        content:
          "Progetta il tuo gioiello personalizzato con il configuratore 3D di Cara Preziosi. Un percorso su misura con il maestro orafo Nicola Caradonna.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.carapreziosi.it/crea-il-tuo-gioiello" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carapreziosi.it/" },
            { "@type": "ListItem", position: 2, name: "Crea il tuo gioiello", item: "https://www.carapreziosi.it/crea-il-tuo-gioiello" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Progettazione gioiello personalizzato con configuratore 3D",
          serviceType: "Progettazione gioiello personalizzato con configuratore 3D",
          description:
            "Configura il tuo gioiello su misura con il configuratore 3D di Cara Preziosi. Un percorso guidato con il maestro orafo Nicola Caradonna, dall'ispirazione al pezzo finito.",
          provider: { "@id": "https://www.carapreziosi.it/#business" },
          areaServed: ["Bari", "Puglia", "Italia"],
          url: "https://www.carapreziosi.it/crea-il-tuo-gioiello",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Come creare il tuo gioiello personalizzato con Cara Preziosi",
          description:
            "Percorso guidato in otto passaggi per progettare un gioiello su misura nell'atelier di Cara Preziosi a Bari, dall'ispirazione iniziale all'invio della richiesta al maestro orafo Nicola Caradonna.",
          url: "https://www.carapreziosi.it/crea-il-tuo-gioiello",
          step: [
            {
              "@type": "HowToStep",
              position: 1,
              name: "Ispirazione",
              text: "Carica un'immagine che racconta lo spirito di ciò che cerchi: un dettaglio, un riferimento, un gioiello visto altrove. È solo il punto di partenza e puoi anche saltare questo passaggio.",
            },
            {
              "@type": "HowToStep",
              position: 2,
              name: "Tipologia",
              text: "Scegli la categoria del gioiello (anello, collana, bracciale, orecchini). Ogni tipologia segue un percorso di lavorazione diverso nel laboratorio.",
            },
            {
              "@type": "HowToStep",
              position: 3,
              name: "Stile",
              text: "Definisci il mood generale del pezzo tra minimal, classico, moderno, statement, romantico o bespoke. Un'indicazione di stile, non una gabbia: l'atelier la interpreterà.",
            },
            {
              "@type": "HowToStep",
              position: 4,
              name: "Materia",
              text: "Scegli il metallo dominante tra oro giallo, oro bianco, oro rosa o platino e seleziona eventualmente una o più pietre (diamante, zaffiro, rubino, smeraldo, perla) oppure nessuna pietra.",
            },
            {
              "@type": "HowToStep",
              position: 5,
              name: "Budget",
              text: "Indica una fascia di budget di riferimento. Serve a calibrare proporzioni, materia e pietre; non è un prezzo finale, che verrà confermato dal maestro orafo dopo la prima lettura.",
            },
            {
              "@type": "HowToStep",
              position: 6,
              name: "Note personali",
              text: "Aggiungi note libere: una persona da celebrare, una data, un riferimento a un gioiello di famiglia. Le tue note arriveranno al maestro orafo insieme alla richiesta.",
            },
            {
              "@type": "HowToStep",
              position: 7,
              name: "Concept",
              text: "L'atelier elabora una prima lettura visiva del tuo gioiello a partire dalle scelte fatte, con la possibilità di visualizzare una bozza in 3D del pezzo.",
            },
            {
              "@type": "HowToStep",
              position: 8,
              name: "Richiesta",
              text: "Invia la richiesta all'atelier. Riceverai una risposta personale dal maestro orafo Nicola Caradonna, di solito entro 24-48 ore. Nessun pagamento, nessun automatismo.",
            },
          ],
        }),
      },
    ],

  }),
  component: AtelierCreatePage,
});

// ─── Static config ─────────────────────────────────────────────
const STEPS = [
  { id: "inspiration", label: "Ispirazione", index: 0 },
  { id: "type", label: "Tipologia", index: 1 },
  { id: "style", label: "Stile", index: 2 },
  { id: "materials", label: "Materia", index: 3 },
  { id: "budget", label: "Budget", index: 4 },
  { id: "notes", label: "Note", index: 5 },
  { id: "preview", label: "Concept", index: 6 },
  { id: "request", label: "Richiesta", index: 7 },
] as const;

type BudgetId = "up-to-1000" | "1000-2000" | "3000-5000" | "5000-plus";

const BUDGETS: Array<{
  id: BudgetId;
  label: string;
  description: string;
  min: number;
  max: number | null;
}> = [
  { id: "up-to-1000", label: "500€+", description: "Pezzi essenziali, gesto raffinato.", min: 500, max: 1000 },
  { id: "1000-2000", label: "1.000 – 2.000€", description: "Lavorazione su misura, dettagli curati.", min: 1000, max: 2000 },
  { id: "3000-5000", label: "3.000 – 5.000€", description: "Creazioni più articolate, pietre selezionate.", min: 3000, max: 5000 },
  { id: "5000-plus", label: "5.000€+", description: "Alto di gamma, pezzi di rappresentanza.", min: 5000, max: null },
];

function formatBudget(b: { min: number; max: number | null }): string {
  const fmt = (n: number) => `${n.toLocaleString("it-IT")}€`;
  return b.max ? `${fmt(b.min)} – ${fmt(b.max)}` : `da ${fmt(b.min)} in su`;
}

const JEWELRY_TYPES = [
  { id: "anello", label: "Anello", description: "Solitari, fedi, anelli di rappresentanza.", icon: <Circle className="h-4 w-4" /> },
  { id: "collana", label: "Collana", description: "Pendenti, girocollo, lunghe editoriali.", icon: <CircleDot className="h-4 w-4" /> },
  { id: "bracciale", label: "Bracciale", description: "Tennis, rigidi, charm bracelets.", icon: <Circle className="h-4 w-4" /> },
  { id: "orecchini", label: "Orecchini", description: "Punti luce, pendenti, statement.", icon: <Gem className="h-4 w-4" /> },
];

const STYLES = [
  { id: "minimal", label: "Minimal", description: "Linee essenziali, geometria pura.", icon: <Feather className="h-4 w-4" /> },
  { id: "classico", label: "Classico", description: "Eleganza senza tempo, gesto tradizionale.", icon: <Crown className="h-4 w-4" /> },
  { id: "moderno", label: "Moderno", description: "Volumi nuovi, segno contemporaneo.", icon: <Star className="h-4 w-4" /> },
  { id: "statement", label: "Statement", description: "Presenza scenica, pezzo che parla.", icon: <Sparkles className="h-4 w-4" /> },
  { id: "romantico", label: "Romantico", description: "Curve morbide, intimità, dettagli a cuore.", icon: <Heart className="h-4 w-4" /> },
  { id: "bespoke", label: "Bespoke", description: "Totalmente disegnato da zero su di te.", icon: <Gem className="h-4 w-4" /> },
];

const METALS = [
  { id: "oro-giallo", label: "Oro giallo", description: "18kt, calore mediterraneo." },
  { id: "oro-bianco", label: "Oro bianco", description: "18kt, eleganza sobria." },
  { id: "oro-rosa", label: "Oro rosa", description: "18kt, tono romantico." },
  { id: "platino", label: "Platino", description: "Per chi cerca purezza assoluta." },
];

const STONES = [
  { id: "diamante", label: "Diamante", description: "Brillanti, taglio classico." },
  { id: "zaffiro", label: "Zaffiro", description: "Blu profondo o varianti." },
  { id: "rubino", label: "Rubino", description: "Rosso intenso, segno passionale." },
  { id: "smeraldo", label: "Smeraldo", description: "Verde naturale, raro." },
  { id: "perla", label: "Perla", description: "Coltivata o naturale." },
  { id: "nessuna", label: "Senza pietra", description: "Solo metallo, gesto puro." },
];

// ─── Page ──────────────────────────────────────────────────────
function AtelierCreatePage() {
  const [step, setStep] = useState(0);
  const [inspiration, setInspiration] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [metal, setMetal] = useState<string | null>(null);
  const [stones, setStones] = useState<string[]>([]);
  const [budget, setBudget] = useState<BudgetId | null>(null);
  const [notes, setNotes] = useState("");
  const [previewStage, setPreviewStage] = useState<PreviewStage>("idle");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [trellisImageUrl, setTrellisImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─── Stato bozza 3D ─────────────────────────────────────────
  const [model3dStage, setModel3dStage] = useState<Model3DStage>("idle");
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [model3dError, setModel3dError] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const submitConceptFn = useServerFn(submitJewelConceptJob);
  const pollConceptFn = useServerFn(pollJewelConceptJob);
  const submit3DFn = useServerFn(submitTrellis3DJob);
  const poll3DFn = useServerFn(pollTrellis3DJob);
  const pollConceptTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const conceptRequestIdRef = useRef<string | null>(null);
  const poll3DTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // requestId Trellis 2 attivo (persistente attraverso timeout del polling)
  const trellisRequestIdRef = useRef<string | null>(null);
  // URL immagine 2D usata per il job 3D corrente (per capire se è cambiata)
  const trellisSourceUrlRef = useRef<string | null>(null);
  const reqIdRef = useRef(0);
  const req3dIdRef = useRef(0);
  const router = useRouter();

  const stopConceptPolling = useCallback(() => {
    if (pollConceptTimerRef.current) {
      clearInterval(pollConceptTimerRef.current);
      pollConceptTimerRef.current = null;
    }
  }, []);

  const resetFlow = useCallback(() => {
    reqIdRef.current++;
    req3dIdRef.current++;
    stopConceptPolling();
    conceptRequestIdRef.current = null;
    if (poll3DTimerRef.current) {
      clearInterval(poll3DTimerRef.current);
      poll3DTimerRef.current = null;
    }
    trellisRequestIdRef.current = null;
    trellisSourceUrlRef.current = null;
    setInspiration(null);
    setType(null);
    setStyle(null);
    setMetal(null);
    setStones([]);
    setBudget(null);
    setNotes("");
    setGeneratedUrl(null);
    setTrellisImageUrl(null);
    setErrorMessage(null);
    setPreviewStage("idle");
    setModel3dStage("idle");
    setModelUrl(null);
    setModel3dError(null);
    setStep(0);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stopConceptPolling]);

  const goBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  }, [router]);

  // ─── Generazione bozza 3D Fal.ai Trellis 2 (submit + polling) ────
  const stop3DPolling = useCallback(() => {
    if (poll3DTimerRef.current) {
      clearInterval(poll3DTimerRef.current);
      poll3DTimerRef.current = null;
    }
  }, []);

  // Avvia il polling per un requestId Trellis 2 (esistente o appena creato).
  // Non lancia un nuovo job: si limita a interrogare lo stato.
  const startPolling3D = useCallback(
    (requestId: string, myReq: number) => {
      stop3DPolling();
      let attempts = 0;
      const MAX_ATTEMPTS = 26; // 26 × 6s ≈ 2 min 36 s
      poll3DTimerRef.current = setInterval(async () => {
        attempts++;
        if (req3dIdRef.current !== myReq) {
          stop3DPolling();
          return;
        }
        if (attempts > MAX_ATTEMPTS) {
          stop3DPolling();
          // Timeout del frontend: NON è un fallimento del job Fal.ai.
          // Conserviamo requestId per consentire la ripresa del polling.
          if (import.meta.env.DEV) {
            console.log(
              "[atelier-3d] requestId",
              requestId,
              "TIMEOUT frontend dopo",
              attempts,
              "tentativi — job ancora recuperabile",
            );
          }
          setModel3dError(
            "La generazione 3D sta impiegando più del previsto. Clicca di nuovo per riprendere senza lanciare un nuovo job.",
          );
          setModel3dStage("timeout_pending");
          return;
        }
        try {
          const res = await poll3DFn({ data: { requestId } });
          if (req3dIdRef.current !== myReq) {
            stop3DPolling();
            return;
          }
          if (import.meta.env.DEV) {
            console.log("[atelier-3d] poll", attempts, "status:", res.status);
          }
          if (res.status === "COMPLETED") {
            stop3DPolling();
            if (import.meta.env.DEV) {
              console.log(
                "[atelier-3d] requestId",
                requestId,
                "COMPLETED in",
                attempts,
                "tentativi",
              );
            }
            setModelUrl(res.glbUrl);
            setModel3dStage("ready");
            return;
          }
          if (res.status === "FAILED") {
            stop3DPolling();
            if (import.meta.env.DEV) {
              console.log(
                "[atelier-3d] requestId",
                requestId,
                "FAILED dopo",
                attempts,
                "tentativi",
              );
            }
            // Job fallito davvero: libera il requestId così il prossimo click
            // potrà sottometterne uno nuovo.
            trellisRequestIdRef.current = null;
            trellisSourceUrlRef.current = null;
            setModel3dError(res.error || "Generazione 3D fallita.");
            setModel3dStage("error");
            return;
          }
          // IN_QUEUE | IN_PROGRESS → continua a fare polling
        } catch (err) {
          if (req3dIdRef.current !== myReq) {
            stop3DPolling();
            return;
          }
          console.error("[atelier-3d] polling failed:", err);
          stop3DPolling();
          setModel3dError(err instanceof Error ? err.message : "Errore inatteso 3D.");
          setModel3dStage("error");
        }
      }, 6000);
    },
    [poll3DFn, stop3DPolling],
  );

  // Riprende il polling su un requestId esistente senza creare un nuovo job.
  const resume3DJobPolling = useCallback(
    (requestId: string) => {
      const myReq = ++req3dIdRef.current;
      setModel3dError(null);
      setModel3dStage("generating");
      if (import.meta.env.DEV) {
        console.log("[atelier-3d] RESUME polling requestId:", requestId);
      }
      startPolling3D(requestId, myReq);
    },
    [startPolling3D],
  );

  const run3DGeneration = useCallback(async () => {
    // Guardia: un solo job alla volta
    if (model3dStage === "generating" || poll3DTimerRef.current) {
      if (import.meta.env.DEV) {
        console.log("[atelier-3d] click ignorato: job 3D già in corso");
      }
      return;
    }
    const sourceImageUrl = trellisImageUrl || generatedUrl;
    if (import.meta.env.DEV) {
      console.log("Concept image URL:", sourceImageUrl);
    }
    if (!sourceImageUrl || !/^https?:\/\//i.test(sourceImageUrl)) {
      setModel3dError("Genera prima il concept immagine.");
      setModel3dStage("error");
      return;
    }

    // Riprendi job esistente se:
    //  - abbiamo un requestId conservato
    //  - l'immagine sorgente non è cambiata
    //  - siamo in timeout_pending oppure in idle/error-recoverable con stesso input
    const existingId = trellisRequestIdRef.current;
    const sameSource = trellisSourceUrlRef.current === sourceImageUrl;
    if (existingId && sameSource && model3dStage !== "ready") {
      if (import.meta.env.DEV) {
        console.log(
          "[atelier-3d] riuso requestId esistente (no nuovo job):",
          existingId,
        );
      }
      resume3DJobPolling(existingId);
      return;
    }

    // Nuovo job: source diversa, nessun requestId attivo o stato non riusabile.
    const myReq = ++req3dIdRef.current;
    stop3DPolling();
    setModel3dError(null);
    setModelUrl(null);
    setModel3dStage("generating");

    let requestId: string;
    try {
      const sub = await submit3DFn({ data: { trellisImageUrl: sourceImageUrl } });
      if (req3dIdRef.current !== myReq) return;
      requestId = sub.requestId;
      trellisRequestIdRef.current = requestId;
      trellisSourceUrlRef.current = sourceImageUrl;
      if (import.meta.env.DEV) {
        console.log("[atelier-3d] NEW requestId creato:", requestId);
      }
    } catch (err) {
      if (req3dIdRef.current !== myReq) return;
      console.error("[atelier-3d] submit failed:", err);
      setModel3dError(err instanceof Error ? err.message : "Errore inatteso 3D.");
      setModel3dStage("error");
      return;
    }

    startPolling3D(requestId, myReq);
  }, [
    model3dStage,
    generatedUrl,
    trellisImageUrl,
    submit3DFn,
    stop3DPolling,
    startPolling3D,
    resume3DJobPolling,
  ]);

  // Stop polling alla smontaggio del componente
  useEffect(() => stop3DPolling, [stop3DPolling]);
  useEffect(() => stopConceptPolling, [stopConceptPolling]);

  const safeFilename = useCallback(
    (ext: string) => {
      const safeType = (type ?? "gioiello").replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
      const safeStyle = (style ?? "concept").replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
      return `cara-preziosi-${safeType}-${safeStyle}.${ext}`;
    },
    [type, style],
  );

  const downloadModel = useCallback(() => {
    if (!modelUrl) return;
    const a = document.createElement("a");
    a.href = modelUrl;
    a.download = safeFilename("glb");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [modelUrl, safeFilename]);

  const downloadSTL = useCallback(async () => {
    if (!modelUrl) return;
    try {
      const [{ GLTFLoader }, { STLExporter }, THREE] = await Promise.all([
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("three/examples/jsm/exporters/STLExporter.js"),
        import("three"),
      ]);
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(modelUrl);
      const scene = gltf.scene;

      const TARGET_SIZE_MM = 30;
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scaleFactor = TARGET_SIZE_MM / maxDim;
      scene.scale.setScalar(scaleFactor);
      scene.updateMatrixWorld(true);

      const exporter = new STLExporter();
      const stlBinary = exporter.parse(scene, { binary: true }) as DataView;

      scene.scale.setScalar(1 / scaleFactor);
      scene.updateMatrixWorld(true);

      const ab = stlBinary.buffer.slice(stlBinary.byteOffset, stlBinary.byteOffset + stlBinary.byteLength) as ArrayBuffer;

      const blob = new Blob([ab], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = safeFilename("stl");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[atelier-3d] STL export failed:", err);
      setModel3dError("Esportazione STL fallita. Riprova.");
    }
  }, [modelUrl, safeFilename]);

  // ─── Entrance + step reveal motion ───
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      gsap.from("[data-atelier-hero-line]", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.08,
        ease: "power4.out",
        delay: 0.25,
      });
      gsap.from("[data-atelier-hero-eyebrow]", { autoAlpha: 0, y: 16, duration: 0.9, delay: 0.15, ease: "power2.out" });
      gsap.from("[data-atelier-hero-meta]", { autoAlpha: 0, y: 20, duration: 1, delay: 0.6, ease: "power2.out" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !stageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-atelier-step-content]",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }, stageRef);
    return () => ctx.revert();
  }, [step]);

  // ─── Polling concept image (queue async) ──────────────────────
  const startConceptPolling = useCallback(
    (requestId: string, myReq: number) => {
      stopConceptPolling();
      let attempts = 0;
      const MAX_ATTEMPTS = 40; // 40 × 6s = 4 min
      pollConceptTimerRef.current = setInterval(async () => {
        attempts++;
        if (reqIdRef.current !== myReq) {
          stopConceptPolling();
          return;
        }
        if (attempts > MAX_ATTEMPTS) {
          stopConceptPolling();
          if (import.meta.env.DEV) {
            console.log("[atelier-concept] requestId", requestId, "TIMEOUT after", attempts);
          }
          setErrorMessage(
            "La generazione immagine sta impiegando troppo tempo. Puoi riprovare a riprendere il polling.",
          );
          setPreviewStage("error");
          return;
        }
        try {
          const res = await pollConceptFn({ data: { requestId } });
          if (reqIdRef.current !== myReq) {
            stopConceptPolling();
            return;
          }
          if (import.meta.env.DEV) {
            console.log("[atelier-concept] poll", attempts, "status:", res.status);
          }
          if (res.status === "COMPLETED") {
            stopConceptPolling();
            conceptRequestIdRef.current = null;
            if (import.meta.env.DEV) {
              console.log("[atelier-concept] image URL:", res.imageUrl);
            }
            setGeneratedUrl(res.imageUrl);
            setTrellisImageUrl(res.trellisImageUrl);
            setPreviewStage("ready");
            return;
          }
          if (res.status === "FAILED") {
            stopConceptPolling();
            conceptRequestIdRef.current = null;
            setErrorMessage(res.error || "Generazione immagine fallita.");
            setPreviewStage("error");
            return;
          }
          // IN_QUEUE | IN_PROGRESS → continua
        } catch (err) {
          if (reqIdRef.current !== myReq) {
            stopConceptPolling();
            return;
          }
          console.error("[atelier-concept] polling failed:", err);
          stopConceptPolling();
          setErrorMessage(err instanceof Error ? err.message : "Errore inatteso.");
          setPreviewStage("error");
        }
      }, 6000);
    },
    [pollConceptFn, stopConceptPolling],
  );

  // ─── Generazione concept reale via Fal GPT Image 2 (queue async) ───
  const runGeneration = useCallback(async () => {
    if (!type || !style || !metal) {
      setErrorMessage("Completa tipologia, stile e materia prima di generare il concept.");
      setPreviewStage("error");
      return;
    }
    const myReq = ++reqIdRef.current;
    // Invalida ogni job 3D in corso o completato: l'utente dovrà ri-cliccare "Genera 3D"
    req3dIdRef.current++;
    stop3DPolling();
    trellisRequestIdRef.current = null;
    trellisSourceUrlRef.current = null;
    stopConceptPolling();
    conceptRequestIdRef.current = null;
    setModel3dStage("idle");
    setModelUrl(null);
    setModel3dError(null);
    setErrorMessage(null);
    setGeneratedUrl(null);
    setTrellisImageUrl(null);
    setPreviewStage("analyzing");

    // micro-pausa estetica: lettura ispirazione
    const tAnalyze = setTimeout(() => {
      if (reqIdRef.current === myReq) setPreviewStage("generating");
    }, 900);

    try {
      const sub = await submitConceptFn({
        data: {
          type: type as "anello" | "collana" | "bracciale" | "orecchini",
          style: style as "minimal" | "classico" | "moderno" | "statement" | "romantico" | "bespoke",
          metal: metal as "oro-giallo" | "oro-bianco" | "oro-rosa" | "platino",
          stones: stones as Array<"diamante" | "zaffiro" | "rubino" | "smeraldo" | "perla" | "nessuna">,
          budget: budget ?? undefined,
          notes,
          inspirationDataUrl:
            inspiration && inspiration.startsWith("data:image/") ? inspiration : undefined,
        },
      });
      clearTimeout(tAnalyze);
      if (reqIdRef.current !== myReq) return;
      conceptRequestIdRef.current = sub.requestId;
      if (import.meta.env.DEV) {
        console.log("[atelier-concept] submitted requestId:", sub.requestId);
      }
      setPreviewStage("generating");
      startConceptPolling(sub.requestId, myReq);
    } catch (err) {
      clearTimeout(tAnalyze);
      if (reqIdRef.current !== myReq) return;
      console.error("[atelier] generation submit failed:", err);
      setErrorMessage(err instanceof Error ? err.message : "Errore inatteso.");
      setPreviewStage("error");
    }
  }, [
    type,
    style,
    metal,
    stones,
    budget,
    notes,
    inspiration,
    submitConceptFn,
    startConceptPolling,
    stop3DPolling,
    stopConceptPolling,
  ]);

  // Riprende il polling sullo stesso requestId senza lanciare un nuovo job.
  const resumeConceptPolling = useCallback(() => {
    const rid = conceptRequestIdRef.current;
    if (!rid) {
      void runGeneration();
      return;
    }
    const myReq = ++reqIdRef.current;
    setErrorMessage(null);
    setPreviewStage("generating");
    if (import.meta.env.DEV) {
      console.log("[atelier-concept] resume polling requestId:", rid);
    }
    startConceptPolling(rid, myReq);
  }, [runGeneration, startConceptPolling]);
  void resumeConceptPolling;

  // Avvia la generazione quando si entra nello step Concept
  useEffect(() => {
    if (step !== 6) return;
    if (previewStage === "ready" && generatedUrl) return; // già generato
    void runGeneration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const toggleStone = (id: string) => {
    setStones((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return true; // inspiration optional
      case 1: return !!type;
      case 2: return !!style;
      case 3: return !!metal;
      case 4: return !!budget;
      case 5: return true;
      case 6: return previewStage === "ready";
      default: return true;
    }
  }, [step, type, style, metal, budget, previewStage]);

  const selectedBudget = useMemo(
    () => BUDGETS.find((b) => b.id === budget) ?? null,
    [budget],
  );

  const summaryItems = [
    { label: "Tipologia", value: JEWELRY_TYPES.find((t) => t.id === type)?.label ?? null },
    { label: "Stile", value: STYLES.find((s) => s.id === style)?.label ?? null },
    { label: "Materia", value: METALS.find((m) => m.id === metal)?.label ?? null },
    {
      label: "Pietre",
      value: stones.length ? stones.map((id) => STONES.find((s) => s.id === id)?.label).filter(Boolean).join(", ") : null,
    },
    {
      label: "Budget stimato",
      value: selectedBudget ? formatBudget(selectedBudget) : null,
    },
    { label: "Note", value: notes.trim() ? `"${notes.trim().slice(0, 60)}${notes.length > 60 ? "…" : ""}"` : null },
  ];

  return (
    <div className="bg-bone text-ink">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section ref={heroRef} className="relative pt-36 md:pt-44 pb-20 md:pb-28 overflow-hidden">
        <span className="glow-orb glow-orb-bone block" style={{ width: "720px", height: "720px", top: "-10%", right: "-200px" }} />
        <span className="glow-orb block" style={{ width: "560px", height: "560px", bottom: "-20%", left: "-180px", opacity: 0.4 }} />

        <div className="container-cara relative">
          <Link
            to="/"
            data-atelier-hero-eyebrow
            className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-ink/60 hover:text-gold-deep transition-colors mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Torna al sito
          </Link>
          <PageBreadcrumb current="Crea il tuo gioiello" className="mb-8" />
          <p className="eyebrow text-gold-deep mb-8">
            Atelier · Creazione personalizzata
          </p>
          <h1
            className="font-display leading-[0.98] text-ink max-w-[18ch]"
            style={{
              fontSize: "clamp(2.5rem, 5.6vw, 5.25rem)",
              fontVariationSettings: '"opsz" 144, "SOFT" 35',
            }}
          >
            <span className="block overflow-hidden">
              <span data-atelier-hero-line className="inline-block">Inizia a immaginare</span>
            </span>
            <span className="block overflow-hidden">
              <span data-atelier-hero-line className="inline-block italic text-gold-deep" style={{ fontStyle: "italic" }}>
                il tuo gioiello.
              </span>
            </span>
          </h1>
          <div data-atelier-hero-meta className="mt-10 grid gap-6 md:grid-cols-12 md:items-end">
            <p className="md:col-span-7 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Carica un'immagine d'ispirazione, definisci stile e materia, ricevi una prima
              interpretazione del nostro atelier. È l'inizio di un percorso su misura — non un acquisto online.
            </p>
            <div className="md:col-span-5 md:text-right space-y-2">
              <p className="eyebrow text-ink/55">Sette gesti · zero serie</p>
              <p className="font-display italic text-xl text-ink/70">Una conversazione, non un form.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── STAGE ───────────────────────── */}
      <section className="relative pb-32 md:pb-44">
        <div className="container-cara">
          {/* Stepper */}
          <div className="mb-12 md:mb-16">
            <CreationStepper steps={STEPS as unknown as { id: string; label: string; index: number }[]} current={step} onJump={setStep} />
          </div>

          <div className="grid gap-10 lg:gap-14 lg:grid-cols-12">
            {/* LEFT — interaction area */}
            <div ref={stageRef} className="lg:col-span-7 min-h-[480px]">
              <div data-atelier-step-content key={step}>
                {step === 0 && (
                  <StepFrame
                    n="01"
                    eyebrow="Ispirazione"
                    title="Una foto vale più di un brief."
                    intro="Carica un'immagine che racconta lo spirito di ciò che cerchi. Un dettaglio, un riferimento, un gioiello visto altrove. È solo il punto di partenza."
                  >
                    <ImageUploadDropzone
                      value={inspiration}
                      onChange={(dataUrl) => setInspiration(dataUrl)}
                    />
                    <p className="mt-4 text-xs text-muted-foreground">
                      Puoi anche saltare questo passaggio: alcuni percorsi nascono solo dalle parole.
                    </p>
                  </StepFrame>
                )}

                {step === 1 && (
                  <StepFrame
                    n="02"
                    eyebrow="Tipologia"
                    title="Che gioiello stai immaginando?"
                    intro="Scegli la categoria. Ogni tipologia segue un percorso di lavorazione diverso nel laboratorio."
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      {JEWELRY_TYPES.map((t) => (
                        <SelectableCard
                          key={t.id}
                          active={type === t.id}
                          onSelect={() => setType(t.id)}
                          eyebrow={t.label}
                          title={t.label}
                          description={t.description}
                          icon={t.icon}
                        />
                      ))}
                    </div>
                  </StepFrame>
                )}

                {step === 2 && (
                  <StepFrame
                    n="03"
                    eyebrow="Stile"
                    title="Definisci il mood."
                    intro="Il segno generale del pezzo. Un'indicazione, non una gabbia: l'atelier la interpreterà."
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      {STYLES.map((s) => (
                        <SelectableCard
                          key={s.id}
                          active={style === s.id}
                          onSelect={() => setStyle(s.id)}
                          title={s.label}
                          description={s.description}
                          icon={s.icon}
                          compact
                        />
                      ))}
                    </div>
                  </StepFrame>
                )}

                {step === 3 && (
                  <StepFrame
                    n="04"
                    eyebrow="Materia"
                    title="Metallo e pietre."
                    intro="Scegli il metallo dominante. Le pietre sono opzionali — selezionane più di una se necessario."
                  >
                    <div className="space-y-8">
                      <div>
                        <p className="eyebrow text-ink/55 mb-4">Metallo</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {METALS.map((m) => (
                            <SelectableCard
                              key={m.id}
                              active={metal === m.id}
                              onSelect={() => setMetal(m.id)}
                              title={m.label}
                              description={m.description}
                              compact
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="eyebrow text-ink/55 mb-4">Pietre · selezione multipla</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {STONES.map((s) => (
                            <SelectableCard
                              key={s.id}
                              active={stones.includes(s.id)}
                              onSelect={() => toggleStone(s.id)}
                              title={s.label}
                              description={s.description}
                              compact
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </StepFrame>
                )}

                {step === 4 && (
                  <StepFrame
                    n="05"
                    eyebrow="Budget"
                    title="Qual è il budget di riferimento?"
                    intro="Una fascia indicativa ci permette di calibrare proporzioni, materia e pietre. Non è un prezzo finale: l'atelier confermerà un preventivo dettagliato dopo la prima lettura."
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      {BUDGETS.map((b) => (
                        <SelectableCard
                          key={b.id}
                          active={budget === b.id}
                          onSelect={() => setBudget(b.id)}
                          eyebrow={formatBudget(b)}
                          title={b.label}
                          description={b.description}
                          compact
                        />
                      ))}
                    </div>
                    {selectedBudget && (
                      <div className="mt-6 rounded-2xl border border-gold-deep/30 bg-bone/60 p-5">
                        <p className="eyebrow text-gold-deep mb-2">Prezzo orientativo</p>
                        <p className="font-display italic text-2xl text-ink leading-tight">
                          {formatBudget(selectedBudget)}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          Stima di partenza. Il prezzo finale dipende da carati, qualità delle pietre e
                          complessità della lavorazione, e verrà confermato dal maestro orafo.
                        </p>
                      </div>
                    )}
                  </StepFrame>
                )}

                {step === 5 && (
                  <StepFrame
                    n="06"
                    eyebrow="Note personali"
                    title="C'è qualcosa che dobbiamo sapere?"
                    intro="Una persona da celebrare, una data, una preferenza. Tutto quello che ci aiuta a leggerti meglio."
                  >
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={7}
                      placeholder="Esempio: è un regalo per un anniversario importante, vorremmo richiamare una vecchia fede di famiglia in oro giallo…"
                      className="w-full rounded-2xl border border-ink/12 bg-bone/40 p-5 md:p-6 text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold-deep focus:bg-bone/60 transition-all duration-500 font-body resize-none"
                    />
                    <p className="mt-3 text-xs text-muted-foreground">
                      Le tue note arriveranno al maestro orafo insieme alla richiesta.
                    </p>
                  </StepFrame>
                )}

                {step === 6 && (
                  <StepFrame
                    n="07"
                    eyebrow="Anteprima"
                    title="Una prima lettura del tuo gioiello."
                    intro="L'atelier sta elaborando il concept. Nelle prossime versioni, qui troverai anche la proposta in 3D del pezzo."
                  >
                    <div className="space-y-6">
                      <ConceptPreviewPanel
                        stage={previewStage}
                        inspirationUrl={inspiration}
                        generatedUrl={generatedUrl}
                        errorMessage={errorMessage}
                        onRetry={runGeneration}
                        summary={{
                          type: JEWELRY_TYPES.find((t) => t.id === type)?.label,
                          style: STYLES.find((s) => s.id === style)?.label,
                        }}
                      />
                      {previewStage === "ready" && generatedUrl && (
                        <div className="rounded-2xl border border-gold-deep/30 bg-bone/60 p-5 md:p-6">
                          <div className="flex flex-col gap-4">
                            {/* Bottone principale: genera o rigenera bozza 3D */}
                            {model3dStage !== "ready" && (
                              <button
                                type="button"
                                onClick={run3DGeneration}
                                disabled={model3dStage === "generating"}
                                className="btn-primary justify-center w-full disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {model3dStage === "generating" ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creazione modello 3D in corso…
                                  </>
                                ) : model3dStage === "error" ? (
                                  <>
                                    <RotateCcw className="h-4 w-4" />
                                    Riprova generazione 3D
                                  </>
                                ) : (
                                  <>
                                    <Box className="h-4 w-4" />
                                    Visualizza il tuo gioiello in 3D
                                  </>
                                )}
                              </button>
                            )}

                            {/* Errore generazione 3D */}
                            {(model3dStage === "error" || model3dStage === "timeout_pending") && model3dError && (
                              <p className="text-sm text-red-600 leading-relaxed">
                                {model3dError}
                              </p>
                            )}

                            {/* Preview 3D interattiva + download */}
                            {model3dStage === "ready" && modelUrl && (
                              <div className="space-y-4">
                                <Suspense fallback={null}>
                                  <Jewel3DViewer src={modelUrl} />
                                </Suspense>
                                <div className="flex flex-wrap gap-3 justify-center">
                                  <button
                                    type="button"
                                    onClick={downloadModel}
                                    className="btn-primary"
                                  >
                                    <Download className="h-4 w-4" />
                                    Scarica modello 3D (.glb)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={downloadSTL}
                                    disabled={!modelUrl}
                                    className="btn-primary"
                                  >
                                    <Download className="h-4 w-4" />
                                    Scarica modello 3D (.stl)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={run3DGeneration}
                                    className="btn-ghost text-ink"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                    Rigenera 3D
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3 justify-center">
                              <button
                                type="button"
                                onClick={resetFlow}
                                className="btn-ghost text-ink"
                              >
                                <RotateCcw className="h-4 w-4" />
                                Ricomincia
                              </button>
                              <button
                                type="button"
                                onClick={goBack}
                                className="btn-ghost text-ink"
                              >
                                <ArrowLeft className="h-4 w-4" />
                                Torna indietro
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </StepFrame>
                )}

                {step === 7 && (
                  <StepFrame
                    n="08"
                    eyebrow="Richiesta"
                    title="Inviamo questo all'atelier?"
                    intro="Riceverai una risposta personale dal nostro maestro orafo, di solito entro 24-48 ore. Nessun pagamento, nessun automatismo."
                  >
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gold-deep/30 bg-bone p-6 md:p-8">
                        <p className="eyebrow text-gold-deep mb-3">Prossimo passo</p>
                        <p className="font-display italic text-2xl md:text-3xl leading-tight text-ink">
                          Una conversazione vera, su misura.
                        </p>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                          La tua richiesta verrà inoltrata al laboratorio Cara Preziosi. Continueremo
                          insieme da un'idea a un pezzo finito, con sopralluoghi e revisioni concordate.
                        </p>
                        {selectedBudget && (
                          <p className="mt-5 text-sm text-ink/80">
                            Fascia di budget indicata:{" "}
                            <span className="font-semibold text-gold-deep">
                              {formatBudget(selectedBudget)}
                            </span>
                          </p>
                        )}
                        <div className="mt-7 flex flex-wrap gap-3">
                          <Link to="/contatti" className="btn-primary">
                            Invia richiesta all'atelier
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <Link to="/contatti" className="btn-ghost text-ink">
                            Prenota una visita
                          </Link>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Il configuratore è una bozza di dialogo. Niente verrà finalizzato senza il tuo confronto diretto.
                      </p>
                    </div>
                  </StepFrame>
                )}
              </div>

              {/* Nav */}
              <div className="mt-10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.3em] text-ink/60 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Indietro
                </button>
                {step < STEPS.length - 1 && (
                  <button
                    type="button"
                    onClick={() => canAdvance && setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    disabled={!canAdvance}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continua
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT — summary + preview teaser */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 lg:self-start">
              <RequestSummaryCard items={summaryItems} />

              {/* Mini preview teaser visible always */}
              <div className="rounded-2xl overflow-hidden border border-ink/10">
                <div className="aspect-[5/4] relative bg-obsidian text-bone">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(60% 60% at 50% 40%, oklch(0.72 0.082 75 / 0.22) 0%, transparent 70%)",
                    }}
                  />
                  {inspiration ? (
                    <img
                      src={inspiration}
                      alt="Anteprima ispirazione"
                      className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <Sparkles className="h-5 w-5 text-gold-deep mb-3" />
                    <p className="font-display italic text-xl md:text-2xl leading-tight text-bone">
                      {step >= 5 ? "Concept in elaborazione" : "Il tuo concept apparirà qui"}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.28em] text-bone/55">
                      Step {String(step + 1).padStart(2, "0")} · {STEPS[step].label}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-ink/10 bg-bone/40 p-5 text-sm text-muted-foreground leading-relaxed">
                <p className="eyebrow text-ink/55 mb-2">Promemoria atelier</p>
                Ogni pezzo viene disegnato, fuso e rifinito a mano nel laboratorio di Bari.
                Nessuna produzione di serie, nessuna delega esterna.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Step frame ──────────────────────────────────────────────
function StepFrame({
  n,
  eyebrow,
  title,
  intro,
  children,
}: {
  n: string;
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8 md:mb-10 flex items-start gap-5">
        <p
          className="font-display italic text-gold-deep leading-none shrink-0"
          style={{
            fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
          }}
        >
          {n}
        </p>
        <div className="pt-2">
          <p className="eyebrow text-gold-deep mb-2">{eyebrow}</p>
          <h2 className="display-md leading-tight text-ink">{title}</h2>
          <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">{intro}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
