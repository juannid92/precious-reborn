import { useCallback, useRef, useState, type DragEvent } from "react";
import { Upload, ImagePlus, X } from "lucide-react";

type Props = {
  value: string | null;
  onChange: (dataUrl: string | null, file: File | null) => void;
};

/**
 * Drag & drop premium per immagine di ispirazione.
 * Mantiene il file solo in memoria (preview locale).
 * Nessuna chiamata API: pronto ad essere collegato in seguito.
 */
export function ImageUploadDropzone({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const readFile = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange(null, null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null, file);
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file && file.type.startsWith("image/")) readFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ${
          dragging
            ? "border-gold-deep bg-bone/60 scale-[1.005]"
            : "border-ink/15 bg-bone/30 hover:border-gold-deep/60 hover:bg-bone/50"
        }`}
        style={{ minHeight: value ? "auto" : "320px" }}
      >
        {value ? (
          <div className="relative">
            <img src={value} alt="Ispirazione caricata" className="w-full h-[420px] object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent pointer-events-none" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null, null);
              }}
              className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-bone/90 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-ink hover:bg-bone transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Rimuovi
            </button>
            <div className="absolute bottom-5 left-5 text-bone">
              <p className="eyebrow text-bone/70">Ispirazione</p>
              <p className="font-display italic text-xl mt-1">Bellissima scelta.</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-12">
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-50 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 35%, oklch(0.72 0.082 75 / 0.12) 0%, transparent 70%)",
              }}
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-bone shadow-[0_4px_24px_-8px_oklch(0.58_0.085_60/0.4)] border border-gold-deep/30 mb-6">
              {dragging ? (
                <ImagePlus className="h-7 w-7 text-gold-deep" />
              ) : (
                <Upload className="h-6 w-6 text-gold-deep" />
              )}
            </div>
            <p className="font-display italic text-2xl md:text-3xl text-ink leading-tight max-w-md">
              Trascina qui la tua ispirazione
            </p>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Una foto, un dettaglio, un riferimento. Il nostro atelier partirà da qui.
            </p>
            <p className="mt-6 eyebrow text-gold-deep">o clicca per scegliere · JPG · PNG · max 8MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => readFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
