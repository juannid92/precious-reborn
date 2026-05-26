import { Sparkles, Layers, Box, AlertTriangle, RotateCw } from "lucide-react";

export type PreviewStage =
  | "idle"
  | "analyzing"
  | "generating"
  | "ready"
  | "error"
  | "render3d-soon";

type Props = {
  stage: PreviewStage;
  inspirationUrl: string | null;
  summary?: { type?: string; style?: string };
  /** URL (o data:URL) del concept generato da Together. */
  generatedUrl?: string | null;
  /** Messaggio errore mostrato in stato "error". */
  errorMessage?: string | null;
  /** Callback per riprovare la generazione. */
  onRetry?: () => void;
};

/**
 * Area preview principale.
 * Predisposta per futura visualizzazione concept AI + proposta 3D.
 * Nessuna falsa generazione: solo stati UI premium.
 */
export function ConceptPreviewPanel({
  stage,
  inspirationUrl,
  summary,
  generatedUrl,
  errorMessage,
  onRetry,
}: Props) {
  return (
    <div className="relative aspect-[4/5] md:aspect-square w-full rounded-3xl overflow-hidden bg-obsidian text-bone border border-gold-deep/25">
      {/* Atmosphere base */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 40%, oklch(0.72 0.082 75 / 0.18) 0%, transparent 60%), radial-gradient(50% 50% at 80% 90%, oklch(0.58 0.085 60 / 0.22) 0%, transparent 70%)",
        }}
      />
      {/* Inspiration ghosted */}
      {inspirationUrl && (
        <img
          src={inspirationUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity"
          style={{ filter: "blur(2px) saturate(0.7)" }}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Sweeping shimmer on processing */}
      {(stage === "analyzing" || stage === "generating") && (
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(120deg, transparent 30%, oklch(0.72 0.082 75 / 0.18) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: "atelier-shimmer 2.4s linear infinite",
          }}
        />
      )}

      <div className="relative h-full flex flex-col">
        {/* Top meta */}
        <div className="flex items-center justify-between p-5 md:p-7">
          <div className="flex items-center gap-2 text-bone/75">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-deep animate-pulse" />
            <span className="eyebrow text-bone/65">Atelier · Anteprima concept</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.28em] text-bone/55">
            {stage === "idle" && "In attesa"}
            {stage === "analyzing" && "Analisi"}
            {stage === "generating" && "Concept"}
            {stage === "ready" && "Pronto"}
            {stage === "error" && "Errore"}
            {stage === "render3d-soon" && "3D · prossimamente"}
          </span>
        </div>

        {/* Center stage */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          {stage === "idle" && (
            <div className="space-y-5 max-w-sm">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-deep/40 text-gold-deep">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="font-display italic text-3xl md:text-4xl leading-tight">
                La tua creazione apparirà qui.
              </p>
              <p className="text-bone/65 text-sm leading-relaxed">
                Completa i passaggi a fianco. L'atelier interpreterà la tua ispirazione e proporrà una prima visione.
              </p>
            </div>
          )}

          {stage === "analyzing" && (
            <PreviewState
              icon={<Layers className="h-6 w-6" />}
              eyebrow="Step uno"
              title="Stiamo leggendo la tua ispirazione."
              note="Forme, proporzioni, luce, materia."
            />
          )}

          {stage === "generating" && (
            <PreviewState
              icon={<Sparkles className="h-6 w-6" />}
              eyebrow="Step due"
              title="Disegniamo il primo concept."
              note="Linee guida, equilibrio, gesti del nostro segno."
            />
          )}

          {stage === "ready" && (
            <div className="space-y-6 max-w-md w-full">
              {generatedUrl ? (
                <>
                  <div className="relative mx-auto w-full max-w-sm aspect-square overflow-hidden rounded-2xl border border-gold-deep/40 shadow-[0_30px_80px_-30px_oklch(0_0_0/0.6)]">
                    <img
                      src={generatedUrl}
                      alt="Concept del gioiello generato dall'atelier"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(60% 60% at 50% 90%, oklch(0 0 0 / 0.35) 0%, transparent 70%)",
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="eyebrow text-gold-deep">Concept v0 · interpretazione atelier</p>
                    <p className="font-display italic text-2xl md:text-3xl leading-tight text-bone">
                      Il tuo {summary?.type?.toLowerCase() || "gioiello"} prende forma.
                    </p>
                    <p className="text-bone/65 text-xs leading-relaxed">
                      Una prima lettura {summary?.style?.toLowerCase() || "su misura"}. Verrà rivisitata
                      dal maestro orafo prima della proposta finale.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-deep text-obsidian shadow-[0_0_0_8px_oklch(0.72_0.082_75/0.18)]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <p className="eyebrow text-gold-deep">Concept pronto</p>
                    <p className="font-display italic text-3xl md:text-4xl leading-tight">
                      Il tuo {summary?.type?.toLowerCase() || "gioiello"} prende forma.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {stage === "error" && (
            <div className="space-y-5 max-w-sm">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-red-400/50 text-red-300">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="eyebrow text-red-300">Generazione interrotta</p>
              <p className="font-display italic text-2xl md:text-3xl leading-tight">
                Qualcosa è andato storto.
              </p>
              <p className="text-bone/65 text-sm">
                {errorMessage || "Riprova tra qualche istante."}
              </p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 rounded-full border border-gold-deep/60 bg-gold-deep/10 px-5 py-2 text-[10.5px] uppercase tracking-[0.3em] text-bone hover:bg-gold-deep hover:text-obsidian transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Riprova
                </button>
              )}
            </div>
          )}



          {stage === "render3d-soon" && (
            <PreviewState
              icon={<Box className="h-6 w-6" />}
              eyebrow="Estensione futura"
              title="Una proposta 3D, presto."
              note="Stiamo preparando la visualizzazione tridimensionale del concept."
            />
          )}
        </div>

        {/* Bottom rail */}
        <div className="p-5 md:p-7 border-t border-bone/10">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-bone/50">
            <span>Concept · v0</span>
            <span>Atelier Cara Preziosi</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes atelier-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

function PreviewState({
  icon,
  eyebrow,
  title,
  note,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <div className="space-y-5 max-w-sm">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-deep/40 text-gold-deep">
        {icon}
      </div>
      <p className="eyebrow text-gold-deep">{eyebrow}</p>
      <p className="font-display italic text-2xl md:text-3xl leading-tight">{title}</p>
      <p className="text-bone/65 text-sm">{note}</p>
      <div className="flex items-center justify-center gap-1.5 pt-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-deep animate-pulse" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold-deep/60 animate-pulse [animation-delay:0.2s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold-deep/40 animate-pulse [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
