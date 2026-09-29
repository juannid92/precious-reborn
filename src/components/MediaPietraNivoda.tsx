import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPietraNivodaProps {
  image: string | null;
  video: string | null;
  alt: string;
  interattivo?: boolean;
}

export function MediaPietraNivoda({
  image,
  video,
  alt,
  interattivo = false,
}: MediaPietraNivodaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [externalMediaAllowed, setExternalMediaAllowed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const calculateScale = () => {
      if (containerRef.current) setScale(containerRef.current.offsetWidth / 500);
    };
    const observer = new ResizeObserver(calculateScale);
    observer.observe(containerRef.current);
    calculateScale();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setExternalMediaAllowed(false);
    setImageError(false);
  }, [image, video]);

  const hasVideo = Boolean(video);
  const hasImage = Boolean(image) && !imageError;

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#0a0a0a]"
    >
      {externalMediaAllowed && hasVideo ? (
        <iframe
          src={video!}
          width="500"
          height="500"
          scrolling="no"
          title={`${alt} — vista 360 del fornitore`}
          className="absolute left-1/2 top-1/2 border-none"
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: "center center",
          }}
          loading="lazy"
          allow="fullscreen"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      ) : hasImage ? (
        <img
          src={image!}
          alt={alt}
          onError={() => setImageError(true)}
          className={cn("absolute inset-0 z-10 h-full w-full object-cover")}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <span className="text-xs font-medium text-bone/50">
            Anteprima statica non disponibile
          </span>
        </div>
      )}

      {hasVideo && !externalMediaAllowed && (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16 text-center">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setExternalMediaAllowed(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-bone/25 bg-bone/95 px-4 py-2 text-xs font-medium text-ink"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {interattivo ? "Attiva vista 360" : "Carica vista 360"}
          </button>
          <p className="mt-2 text-[10px] text-bone/65">
            Il contenuto esterno viene caricato solo su richiesta.
          </p>
        </div>
      )}
    </div>
  );
}
