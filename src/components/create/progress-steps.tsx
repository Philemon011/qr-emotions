/**
 * Indicateur de progression du parcours de création (3 étapes).
 * Simple, discret, mais donne immédiatement le sentiment "je sais où j'en suis".
 */

const STEPS = ["Occasion", "Thème", "Message"];

export function ProgressSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="mx-auto flex w-full max-w-xs items-center gap-2 px-5 sm:max-w-sm">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="h-1 w-full rounded-full transition-colors duration-300"
              style={{
                backgroundColor: isDone || isActive ? "var(--color-brand-500)" : "var(--color-ink-100)",
              }}
            />
            <span
              className="text-[11px] font-medium transition-colors duration-300"
              style={{ color: isActive ? "var(--color-ink-950)" : "var(--color-ink-300)" }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}