import type { ReactNode } from "react";
import { Check } from "lucide-react";

type Props = {
  active: boolean;
  onSelect: () => void;
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  compact?: boolean;
};

/**
 * Card selezionabile riusabile per tipo gioiello, stile, materiale.
 * Look editoriale, gold accent quando attiva.
 */
export function SelectableCard({ active, onSelect, eyebrow, title, description, icon, compact }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group relative text-left rounded-2xl border transition-all duration-500 overflow-hidden w-full ${
        compact ? "p-5" : "p-6 md:p-7"
      } ${
        active
          ? "border-gold-deep bg-bone shadow-[0_10px_40px_-18px_oklch(0.58_0.085_60/0.5)] -translate-y-0.5"
          : "border-ink/12 bg-bone/40 hover:border-gold-deep/60 hover:bg-bone/70 hover:-translate-y-0.5"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(80% 80% at 50% 0%, oklch(0.72 0.082 75 / 0.14) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex items-start gap-4">
        {icon && (
          <div
            className={`shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
              active ? "border-gold-deep text-gold-deep" : "border-ink/15 text-ink/60 group-hover:text-gold-deep"
            }`}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {eyebrow && <p className="eyebrow text-gold-deep mb-1.5">{eyebrow}</p>}
          <h4 className={`font-display ${compact ? "text-lg" : "text-xl md:text-2xl"} leading-tight text-ink`}>
            {title}
          </h4>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
        <span
          aria-hidden="true"
          className={`shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
            active
              ? "bg-gold-deep border-gold-deep text-bone scale-100"
              : "border-ink/20 text-transparent scale-90"
          }`}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </div>
    </button>
  );
}
