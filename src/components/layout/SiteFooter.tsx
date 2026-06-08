import { Link } from "@tanstack/react-router";
import { brand, contacts, navigation, atelierManifesto } from "@/content/site";
import { CookiePreferencesLink } from "@/components/cookie/CookiePreferencesLink";

const logoCara = "/brand/cara-preziosi-logo.png";

export function SiteFooter() {
  return (
    <footer className="bg-obsidian text-bone noise relative">
      <div className="container-cara pt-24 md:pt-32 pb-12">
        {/* Manifesto closing */}
        <div className="border-b border-bone/10 pb-20 mb-16">
          <p className="eyebrow text-gold mb-8">Atelier · Bari</p>
          <p className="display-lg max-w-5xl">
            <span className="italic font-display text-gold">Su appuntamento.</span>{" "}
            Nel laboratorio di Via Beatillo, dove i gioielli nascono uno alla volta.
          </p>
          <div className="mt-10">
            <Link to="/contatti" className="btn-ghost text-bone">
              Prenota una visita
            </Link>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={logoCara}
                alt="Cara Preziosi"
                className="h-12 md:h-14 w-auto select-none brightness-0 invert"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
              <span className="font-display text-3xl italic text-gold">Preziosi</span>
            </div>
            <p className="text-bone/60 text-sm leading-relaxed max-w-sm">
              {atelierManifesto.body}
            </p>
            <p className="text-bone/40 text-xs italic font-display">{atelierManifesto.signature}</p>
          </div>

          <div className="md:col-span-3 md:col-start-6">
            <p className="eyebrow text-gold mb-5">Indice</p>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-bone/75 hover:text-gold transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <p className="eyebrow text-gold mb-5">L'atelier</p>
            <p className="font-display text-xl leading-snug text-bone">
              {contacts.address}<br />{contacts.city}
            </p>
            <p className="text-sm text-bone/70">{contacts.hours}</p>
            <a href={contacts.phoneHref} className="block text-sm text-bone/80 underline-gold w-fit">
              {contacts.phone}
            </a>
            <a href={contacts.emailHref} className="block text-sm text-bone/80 underline-gold w-fit">
              {contacts.email}
            </a>
            <div className="flex gap-5 pt-3 text-sm">
              <a href={contacts.instagramHref} target="_blank" rel="noreferrer" className="text-bone/70 hover:text-gold transition-colors">
                Instagram
              </a>
              <a href={contacts.facebookHref} target="_blank" rel="noreferrer" className="text-bone/70 hover:text-gold transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-bone/10 mt-16 pt-8 flex flex-col md:flex-row justify-between gap-3 text-xs text-bone/40">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} {brand.name} · Laboratorio orafo · Bari, Italia</p>
            <p>CARA S.R.L · Via Antonio Beatillo 14 — 70121 Bari (BA), Italia</p>
            <p>P.I. — C.F.: 08895310723</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="text-bone/60 hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookie-policy" className="text-bone/60 hover:text-gold transition-colors">
              Cookie Policy
            </Link>
            <CookiePreferencesLink className="text-bone/60 hover:text-gold transition-colors" />
            <span>Made with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
/*
 * Verificare sempre configurazione Analytics, anonimizzazione, tempi di
 * conservazione, policy e assetto reale del progetto con un consulente privacy.
 */
