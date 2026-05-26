type SummaryItem = { label: string; value: string | null };

type Props = {
  items: SummaryItem[];
};

/**
 * Riepilogo laterale della richiesta in costruzione.
 * Editoriale, hairline gold, valori in italic display.
 */
export function RequestSummaryCard({ items }: Props) {
  return (
    <aside className="rounded-2xl border border-ink/12 bg-bone/60 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-center justify-between mb-5">
        <p className="eyebrow text-gold-deep">La tua richiesta</p>
        <span className="hairline-gold flex-1 ml-4 hidden md:block" />
      </div>
      <dl className="space-y-4">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-4 border-b border-ink/8 pb-3 last:border-0 last:pb-0">
            <dt className="text-[10px] uppercase tracking-[0.28em] text-ink/55 shrink-0">{it.label}</dt>
            <dd
              className={`text-right font-display ${
                it.value ? "text-ink italic text-base md:text-lg" : "text-ink/35 text-sm"
              }`}
            >
              {it.value ?? "— da definire"}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
