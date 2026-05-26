/**
 * Viewer 3D interattivo del gioiello generato via Stability AI.
 * - Usa <model-viewer> (@google/model-viewer) come web component.
 * - Caricato SOLO lato client (SSR-safe) via dynamic import in useEffect.
 * - Supporta rotazione (drag), zoom (wheel/pinch), auto-rotate, centratura.
 */
import { useEffect, useState } from "react";

type Props = {
  /** data:model/gltf-binary;base64,... oppure blob URL */
  src: string;
  className?: string;
};

export function Jewel3DViewer({ src, className }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Carica il web component solo nel browser.
    import("@google/model-viewer")
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => {
        console.error("[Jewel3DViewer] failed to load model-viewer:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div
        className={
          className ??
          "w-full min-h-[70vh] md:min-h-[80vh] rounded-2xl bg-obsidian/80 flex items-center justify-center text-bone/60 text-xs uppercase tracking-[0.28em]"
        }
      >
        Caricamento viewer 3D…
      </div>
    );
  }

  // Web component: usa attributi HTML standard.
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <model-viewer
      src={src}
      alt="Anteprima 3D del gioiello"
      camera-controls
      auto-rotate
      auto-rotate-delay={1500}
      rotation-per-second="20deg"
      interaction-prompt="auto"
      exposure="1.05"
      shadow-intensity="1"
      environment-image="neutral"
      camera-orbit="35deg 75deg auto"
      field-of-view="32deg"
      min-camera-orbit="auto auto 25%"
      max-camera-orbit="auto auto 200%"
      style={{
        width: "100%",
        height: "min(80vh, 780px)",
        minHeight: "520px",
        background:
          "radial-gradient(60% 60% at 50% 40%, oklch(0.72 0.082 75 / 0.18) 0%, oklch(0.18 0.012 60) 70%)",
        borderRadius: "1rem",
      }}
      className={className}
    />
  );
}

// Tipi minimi per JSX
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "auto-rotate-delay"?: number;
          "rotation-per-second"?: string;
          "interaction-prompt"?: string;
          exposure?: string;
          "shadow-intensity"?: string;
          "environment-image"?: string;
          "camera-orbit"?: string;
          "field-of-view"?: string;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
        },
        HTMLElement
      >;
    }
  }
}
