import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Gem } from "lucide-react";

interface StoneMediaProps {
  image: string | null;
  video: string | null;
  title: string;
  isCard?: boolean;
}

/**
 * Gestore media per le pietre (diamanti e gemme).
 * Implementa logica di fallback: Immagine -> Video (se fallisce o non c'è) -> Placeholder.
 * Supporta hover su desktop per mostrare il video 360 nelle card.
 * Garantisce che l'iframe non intercetti il clic sovrapponendo uno strato trasparente.
 */
export function StoneMedia({ image, video, title, isCard = false }: StoneMediaProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hover, setHover] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Nelle card di colore l'immagine è spesso assente, mostriamo subito il video se disponibile.
  // Su desktop nelle card, se c'è l'immagine, mostriamo il video solo in hover.
  // Se l'immagine fallisce, mostriamo permanentemente il video.
  const showVideoPermanently = video && (!image || hasImageError);
  const showVideoOnHover = video && hover && !isTouch && image && !hasImageError;
  const showVideo = showVideoPermanently || showVideoOnHover;

  const showPlaceholder = !video && (!image || hasImageError);

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-bone-deep/40"
      onMouseEnter={() => isCard && !isTouch && setHover(true)}
      onMouseLeave={() => isCard && !isTouch && setHover(false)}
    >
      {/* Background animato (Shimmer/Pulse) mentre carica o come base */}
      {(!imageLoaded || showVideo) && !showPlaceholder && (
        <div className="absolute inset-0 bg-ink/5 flex items-center justify-center">
          {!showVideo && <Loader2 className="h-6 w-6 animate-spin text-ink/10" />}
        </div>
      )}

      {/* Immagine statica */}
      {image && !hasImageError && !showVideoPermanently && (
        <img
          src={image}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setHasImageError(true)}
          className={`h-full w-full object-cover transition-all duration-700 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          } ${showVideoOnHover ? "opacity-0" : "opacity-100"} ${isCard ? "group-hover:scale-[1.03]" : ""}`}
        />
      )}

      {/* Video Iframe (360) */}
      {showVideo && (
        <div className="absolute inset-0 h-full w-full">
          <iframe
            src={video!}
            title={title}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen"
            loading="lazy"
          />
          {/* Strato trasparente solo nelle card per intercettare il clic ed evitare che finisca nel sito del fornitore. 
              Nelle pagine di dettaglio (isCard=false) l'utente deve poter interagire col modello. */}
          {isCard && <div className="absolute inset-0 z-10 cursor-pointer" />}
        </div>
      )}

      {/* Placeholder Elegante */}
      {showPlaceholder && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center">
          <div className="rounded-full bg-ink/5 p-5">
             <Gem className="h-7 w-7 text-ink/20" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink/40">
            Immagine non ancora disponibile
          </p>
        </div>
      )}

      {/* Indicatore 360 discreto */}
      {video && isCard && (
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full bg-bone/90 px-2.5 py-1 text-[10px] font-bold tracking-tight text-gold-deep shadow-sm backdrop-blur-sm border border-gold-deep/20 pointer-events-none">
          <RefreshCw className="h-2.5 w-2.5" />
          360
        </div>
      )}
    </div>
  );
}

