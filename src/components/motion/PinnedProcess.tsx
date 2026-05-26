import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
  image: string;
};

type Props = {
  eyebrow: string;
  title: string;
  steps: ProcessStep[];
};

export function PinnedProcess({ eyebrow, title, steps }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapRef.current || !sectionRef.current) return;

    const root = wrapRef.current;
    const section = sectionRef.current;
    const images = root.querySelectorAll("[data-image]");
    const titles = root.querySelectorAll("[data-title]");
    const progress = root.querySelector("[data-progress]");
    const total = steps.length;

    const ctx = gsap.context(() => {
      // Deterministic initial states for bi-directional scroll stability
      gsap.set(images, { autoAlpha: 0, scale: 1.05 });
      gsap.set(images[0], { autoAlpha: 1, scale: 1 });
      gsap.set(titles, { autoAlpha: 0, y: 30 });
      gsap.set(titles[0], { autoAlpha: 1, y: 0 });

      const scrollDistance = total * 750 + 900; // Optimized + hold for last slide

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: root,
          pinSpacing: true,
          scrub: 0.8, // Slightly more responsive
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      steps.forEach((_, i) => {
        if (i === 0) return;
        const prev = i - 1;
        const startTime = i;

        mainTl.to(images[prev], { autoAlpha: 0, scale: 1.1, duration: 0.8 }, startTime)
              .to(images[i], { autoAlpha: 1, scale: 1, duration: 0.8 }, startTime)
              .to(titles[prev], { autoAlpha: 0, y: -40, duration: 0.6 }, startTime)
              .to(titles[i], { autoAlpha: 1, y: 0, duration: 0.6 }, startTime + 0.1);
      });

      // Hold last slide fully visible before pin release
      mainTl.to({}, { duration: 1.5 }, `>`);


      if (progress) {
        gsap.to(progress, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${scrollDistance}`,
            scrub: true
          }
        });
      }
    }, section);

    // Re-measure once all images/fonts are loaded so first-scroll triggers correctly
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [steps]);


  return (
    <section ref={sectionRef} className="bg-obsidian text-bone noise min-h-screen">
      <div ref={wrapRef} className="relative h-[100dvh] w-full overflow-hidden">
        {/* Mobile-safe Grid Structure */}
        <div className="absolute inset-0 flex flex-col md:grid md:grid-cols-12">
          
          {/* Progress Rail: Fixed width on mobile, 1 col on desktop */}
          <div className="hidden md:flex md:col-span-1 relative border-r border-bone/10 flex-col items-center pt-32">
            <p className="eyebrow text-gold rotate-180 [writing-mode:vertical-rl] tracking-[0.36em] text-[10px]">
              {eyebrow}
            </p>
            <div className="relative flex-1 w-px bg-bone/10 mt-12 mb-12">
              <div data-progress className="absolute inset-x-0 top-0 w-px bg-gold origin-top" />
            </div>
          </div>

          {/* Image Area: Full width on mobile top, 7 cols on desktop */}
          <div className="relative h-[40vh] md:h-full md:col-span-7 overflow-hidden">
            {steps.map((s, i) => (
              <div key={i} data-image className="absolute inset-0">
                <img src={s.image} alt={s.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-obsidian/40 via-transparent to-obsidian/30" />
              </div>
            ))}
          </div>

          {/* Text Area: Flexible on mobile, 4 cols on desktop */}
          <div className="relative flex-1 flex flex-col justify-center px-6 py-12 md:px-12 xl:px-16 md:col-span-4 bg-obsidian/95 backdrop-blur-md">
            <p className="eyebrow text-gold mb-4 md:mb-6 text-[10px] md:text-[11px]">{title}</p>
            
            <div className="relative h-[40vh] md:h-[60vh]">
              {steps.map((s, i) => (
                <div key={i} data-title className="absolute inset-0 flex flex-col justify-center">
                  <p className="font-display italic text-gold mb-2 md:mb-6 text-base md:text-2xl">— {s.number}</p>
                  <h3 className="font-display leading-[1.05] text-bone mb-3 md:mb-6 text-[clamp(1.5rem,5vw,2.5rem)]">{s.title}</h3>
                  <p className="text-bone/70 leading-relaxed max-w-md text-[clamp(0.85rem,2vw,1rem)]">{s.body}</p>
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-8 right-8 md:bottom-10 md:right-12 text-bone/40 text-[9px] md:text-xs tracking-[0.3em]">SCROLL ↓</div>
          </div>

          {/* Mobile Progress (Alternative for narrow screens) */}
          <div className="md:hidden absolute left-0 top-0 bottom-0 w-1 bg-bone/5 z-50">
            <div data-progress className="absolute inset-x-0 top-0 bg-gold origin-top h-full w-full scale-y-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
