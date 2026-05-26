import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { navigation, contacts } from "@/content/site";
import logoCara from "@/assets/logo-cara.png";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const headerBg = scrolled
    ? "bg-bone/92 backdrop-blur-xl text-ink shadow-[0_1px_0_0_oklch(0.72_0.082_75/0.25),0_8px_24px_-18px_oklch(0_0_0/0.18)]"
    : "bg-bone/65 backdrop-blur-md text-ink";

  return (
    <>
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${headerBg}`}>
      <div className="container-cara flex items-center justify-between py-4 lg:py-6">
        <Link to="/" onClick={() => setOpen(false)} aria-label="Cara Preziosi" className="group flex items-center gap-2.5">
          <img src={logoCara} alt="Cara" className="h-8 md:h-10 w-auto select-none" draggable={false} width="146" height="56" />
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-xl md:text-2xl tracking-tight leading-none italic text-gold-deep hidden sm:inline">
              Preziosi
            </span>
            <span className="text-[8px] uppercase tracking-[0.35em] opacity-70 hidden md:inline ml-0.5">Atelier Orafo</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navigation.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link text-[11px] uppercase tracking-[0.2em] font-medium"
              activeProps={{ "data-active": "true" } as Record<string, string>}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-3 p-1.5 bg-ink/5 rounded-full border border-ink/5">
            <a
              href={contacts.phoneHref}
              aria-label={`Chiama ${contacts.phone}`}
              className="btn-primary !py-2.5 !px-6 !text-[10px] !tracking-[0.2em]"
            >
              Chiama
            </a>
            <a
              href={contacts.whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Contattaci su WhatsApp"
              className="text-[10px] uppercase tracking-[0.2em] font-medium px-4 hover:text-gold-deep transition-colors"
            >
              WhatsApp
            </a>
          </div>
          <Link to="/contatti" className="btn-ghost !py-2.5 !px-6 !text-[10px] !tracking-[0.2em]">
            Prenota
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 -mr-2 transition-transform duration-300 active:scale-90"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>

    {mounted &&
      createPortal(
        <div
          className={`lg:hidden fixed inset-0 z-[100] text-bone transition-opacity duration-300 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{ backgroundColor: "oklch(0.215 0.130 265)" }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Chiudi menu"
            className="absolute top-4 right-4 p-2 text-bone hover:text-gold transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="h-full w-full overflow-y-auto">
            <div className="container-cara min-h-full flex flex-col gap-10 pt-24 pb-12">
              <nav className="flex flex-col gap-3">
                {navigation.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl font-light tracking-wide text-bone hover:text-gold transition-colors"
                    activeProps={{ className: "font-display text-2xl font-light tracking-wide text-gold italic" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-bone/10 pt-8 space-y-6 mt-auto">
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold/90">Contatti diretti</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={contacts.phoneHref}
                      className="btn-primary !py-3 !px-6 !text-[10px] !tracking-[0.25em] flex-1 text-center"
                    >
                      Chiama ora
                    </a>
                    <a
                      href={contacts.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost !py-3 !px-6 !text-[10px] !tracking-[0.25em] flex-1 text-center border-bone/20 text-bone hover:border-gold"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold/90">L'atelier</p>
                  <p className="font-display text-base font-light leading-snug text-bone/90">{contacts.address}, {contacts.city}</p>
                </div>

                <div className="flex gap-6 pt-1 text-[10px] text-gold tracking-[0.25em] uppercase">
                  <a href={contacts.instagramHref} target="_blank" rel="noreferrer" className="hover:text-bone transition-colors">Instagram</a>
                  <a href={contacts.facebookHref} target="_blank" rel="noreferrer" className="hover:text-bone transition-colors">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
