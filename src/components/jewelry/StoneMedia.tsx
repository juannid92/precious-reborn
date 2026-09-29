import { useEffect, useState } from "react";
import { Gem, RefreshCw } from "lucide-react";

interface StoneMediaProps {
  image: string | null;
  video: string | null;
  title: string;
  isCard?: boolean;
}

/** I media 360 di terze parti vengono caricati solo dopo un'azione esplicita. */
export function StoneMedia({ image, video, title, isCard = false }: StoneMediaProps) {
  const [imageError, setImageError] = useState(false);
  const [externalMediaAllowed, setExternalMediaAllowed] = useState(false);

  useEffect(() => {
    setExternalMediaAllowed(false);
    setImageError(false);
  }, [image, video]);

  const hasImage = Boolean(image) && !imageError;
  const hasVideo = Boolean(video);

  return (
    <div className="relative h-full w-full overflow-hidden bg-bone-deep/40">
      {externalMediaAllowed && hasVideo ? (
        <iframe
          src={video!}
          title={`${title} — vista 360 del fornitore`}
          className="h-full w-full border-0"
          allow="fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      ) : hasImage ? (
        <img
          src={image!}
          alt={title}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover transition-transform duration-700 ${isCard ? "group-hover:scale-[1.03]" : ""}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center">
          <div className="rounded-full bg-ink/5 p-5">
            <Gem className="h-7 w-7 text-ink/20" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink/40">
            Anteprima statica non disponibile
          </p>
        </div>
      )}

      {hasVideo && !externalMediaAllowed && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setExternalMediaAllowed(true);
          }}
          className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-gold-deep/20 bg-bone/95 px-3 py-1.5 text-[10px] font-bold text-gold-deep shadow-sm backdrop-blur"
          aria-label={`Carica la vista 360 esterna di ${title}`}
        >
          <RefreshCw className="h-3 w-3" />
          Attiva 360
        </button>
      )}

      {externalMediaAllowed && isCard && <div className="absolute inset-0 z-10 cursor-pointer" />}
    </div>
  );
}
