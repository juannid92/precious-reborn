import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  speed?: number; // seconds per loop
  className?: string;
};

/**
 * Pure-CSS infinite horizontal marquee. Duplicates content twice.
 */
export function Marquee({ children, speed = 40, className = "" }: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex w-max items-center gap-12 will-change-transform"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        <div className="flex items-center gap-12 shrink-0">{children}</div>
        <div className="flex items-center gap-12 shrink-0" aria-hidden>
          {children}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
