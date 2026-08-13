import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // K = larghezza / 500
        setScale(width / 500);
      }
    };

    const observer = new ResizeObserver(() => {
      calculateScale();
    });

    observer.observe(containerRef.current);
    calculateScale(); // Initial calculation

    return () => observer.disconnect();
  }, []);

  const showVideo = interattivo || imageError || !image;
  const hasVideo = Boolean(video);
  const hasImage = Boolean(image) && !imageError;

  // Fallback case: nothing available
  if (!hasImage && !hasVideo) {
    return (
      <div
        ref={containerRef}
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ink/10 flex items-center justify-center p-6 text-center"
      >
        <span className="text-xs text-ink/40 font-medium">Immagine non ancora disponibile</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#0a0a0a]"
    >
      {/* Video Viewport (Iframe scaled) */}
      {hasVideo && (showVideo || interattivo) && (
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{ pointerEvents: interattivo ? "auto" : "none" }}
        >
          <iframe
            src={video!}
            width="500"
            height="500"
            scrolling="no"
            frameBorder="0"
            title={alt}
            className="absolute left-1/2 top-1/2 border-none"
            style={{
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: "center center",
            }}
          />
        </div>
      )}

      {/* Image Viewport (Static) */}
      {hasImage && !interattivo && !imageError && (
        <img
          src={image!}
          alt={alt}
          onError={() => setImageError(true)}
          className={cn(
            "absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-300",
            (imageError || (showVideo && hasVideo)) ? "opacity-0" : "opacity-100"
          )}
        />
      )}
    </div>
  );
}
