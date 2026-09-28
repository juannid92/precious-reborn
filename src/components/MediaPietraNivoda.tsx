import { useEffect, useRef, useState } from "react";

interface MediaPietraNivodaProps {
  image: string | null;
  video: string | null;
  alt: string;
  /** Mantiene il supporto esistente per la vista 360 nei dettagli. */
  interattivo?: boolean;
}

const BASE_MEDIA_SIZE = 500;

/**
 * Mostra prima la fotografia del catalogo; se manca o non si carica, usa il
 * viewer Nivoda come fa il preview di Antonello. Il viewer viene ridimensionato
 * dentro il riquadro, invece di affidarsi alle dimensioni responsive del frame.
 */
export function MediaPietraNivoda({
  image,
  video,
  alt,
  interattivo = false,
}: MediaPietraNivodaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Il componente resta montato mentre si passa da una pietra all'altra.
  // Azzera il fallback per non trascinare l'errore dell'immagine precedente.
  useEffect(() => {
    setImageError(false);
  }, [image, video]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateScale = () => {
      const width = element.clientWidth;
      if (width > 0) setScale(width / BASE_MEDIA_SIZE);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateScale);
      observer.observe(element);
    }

    return () => {
      window.removeEventListener("resize", updateScale);
      observer?.disconnect();
    };
  }, []);

  const hasImage = Boolean(image) && !imageError;
  const hasVideo = Boolean(video);
  const showVideo = interattivo || !hasImage;

  if (!hasImage && !hasVideo) {
    return (
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-[#0B0810] p-6 text-center">
        <div className="flex flex-col items-center">
          <span className="mb-3 text-2xl leading-none text-[#C8A84B]">&#9670;</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A79E90]">
            Immagine non ancora disponibile
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#0B0810]"
    >
      {hasVideo && showVideo && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ pointerEvents: interattivo ? "auto" : "none" }}
        >
          <iframe
            key={video}
            src={video!}
            title={alt}
            width={BASE_MEDIA_SIZE}
            height={BASE_MEDIA_SIZE}
            scrolling="no"
            frameBorder={0}
            allow="autoplay; fullscreen"
            loading="lazy"
            tabIndex={interattivo ? 0 : -1}
            aria-hidden={!interattivo}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: BASE_MEDIA_SIZE,
              height: BASE_MEDIA_SIZE,
              border: "none",
              overflow: "hidden",
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: "center center",
              pointerEvents: interattivo ? "auto" : "none",
              opacity: scale > 0 ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        </div>
      )}

      {hasImage && !interattivo && (
        <img
          key={image}
          src={image!}
          alt={alt}
          loading="lazy"
          draggable={false}
          onError={() => setImageError(true)}
          className="absolute inset-0 z-10 h-full w-full select-none object-cover"
        />
      )}
    </div>
  );
}
