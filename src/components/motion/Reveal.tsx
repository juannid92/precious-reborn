import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: ReactNode;
  as?: "div" | "section" | "p" | "span" | "h1" | "h2" | "h3";
  delay?: number;
  y?: number;
  className?: string;
  /** ScrollTrigger start. Default "top 85%". Use "top bottom" per anticipare. */
  start?: string;
};

/**
 * Fades + slides children into view on scroll. SSR-safe.
 */
export function Reveal({ children, as = "div", delay = 0, y = 32, className, start = "top 85%" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === "undefined") return;

    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y, start]);


  const Tag = as as "div";
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}
