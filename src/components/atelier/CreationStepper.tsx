type Step = { id: string; label: string; index: number };

type Props = {
  steps: Step[];
  current: number;
  onJump: (index: number) => void;
};

/**
 * Stepper orizzontale editoriale — hairline gold continua,
 * pallini numerati, label uppercase.
 */
export function CreationStepper({ steps, current, onJump }: Props) {
  const progress = steps.length > 1 ? current / (steps.length - 1) : 0;
  return (
    <div className="w-full">
      <div className="relative">
        {/* Rail */}
        <div className="absolute left-0 right-0 top-3 h-px bg-ink/10" aria-hidden="true" />
        <div
          className="absolute left-0 top-3 h-px bg-gold-deep transition-all duration-700 ease-out"
          style={{ width: `${progress * 100}%` }}
          aria-hidden="true"
        />
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((s) => {
            const done = s.index < current;
            const active = s.index === current;
            return (
              <li key={s.id} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  disabled={s.index > current}
                  onClick={() => onJump(s.index)}
                  className="group flex flex-col items-center focus:outline-none disabled:cursor-not-allowed"
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={`relative z-[1] flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-medium transition-all duration-500 ${
                      active
                        ? "bg-gold-deep border-gold-deep text-bone scale-110 shadow-[0_0_0_6px_oklch(0.72_0.082_75/0.18)]"
                        : done
                          ? "bg-gold-deep/90 border-gold-deep text-bone"
                          : "bg-bone border-ink/20 text-ink/40"
                    }`}
                  >
                    {String(s.index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`mt-3 text-[9px] md:text-[10px] uppercase tracking-[0.28em] transition-colors whitespace-nowrap ${
                      active ? "text-ink" : done ? "text-ink/70" : "text-ink/35"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
