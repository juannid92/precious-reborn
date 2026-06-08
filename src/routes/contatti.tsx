import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { brand, contacts } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Prenota un Appuntamento in Atelier · Cara Preziosi Bari" },
      {
        name: "description",
        content:
          "Contatta Cara Preziosi e prenota il tuo appuntamento in atelier a Bari. Via Antonio Beatillo 14, consulenza su misura per gioielli artigianali unici.",
      },
      { property: "og:title", content: "Contatti — Prenota un Appuntamento in Atelier · Cara Preziosi Bari" },
      {
        property: "og:description",
        content:
          "Contatta Cara Preziosi e prenota il tuo appuntamento in atelier a Bari. Via Antonio Beatillo 14, consulenza su misura per gioielli artigianali unici.",
      },
      { property: "og:url", content: "https://www.carapreziosi.it/contatti" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:image", content: "https://www.carapreziosi.it/brand/cara-preziosi-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contatti — Prenota un Appuntamento in Atelier · Cara Preziosi Bari" },
      {
        name: "twitter:description",
        content:
          "Contatta Cara Preziosi e prenota il tuo appuntamento in atelier a Bari. Via Antonio Beatillo 14, consulenza su misura per gioielli artigianali unici.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.carapreziosi.it/contatti" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carapreziosi.it/" },
            { "@type": "ListItem", position: 2, name: "Contatti", item: "https://www.carapreziosi.it/contatti" },
          ],
        }),
      },
    ],
  }),
  component: ContattiPage,
});

function ContattiPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-bone text-ink pt-40 md:pt-56 pb-16 md:pb-24">
        <div className="container-cara">
          <p className="eyebrow text-gold-deep mb-8">L'incontro</p>
          <Reveal as="h1" className="display-xl max-w-6xl">
            Su <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>appuntamento</em>,<br />
            nell'atelier di Bari.
          </Reveal>
          <Reveal delay={0.15} className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-5 md:col-start-3 text-lg text-muted-foreground leading-relaxed">
              Scrivici, chiamaci o scrivi un messaggio. Risponderemo per
              fissare la tua visita in atelier — un caffè, un disegno, le tue
              idee. Senza fretta, senza pressione.
            </p>
          </Reveal>
        </div>
      </section>

      {/* MAIN SPLIT */}
      <section className="bg-bone text-ink py-20 md:py-28">
        <div className="container-cara grid gap-16 lg:gap-24 lg:grid-cols-12">
          {/* LEFT — info */}
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-gold-deep mb-8">L'atelier</p>
            <p className="display-md mb-12 leading-tight">
              {contacts.address}<br />{contacts.city}
            </p>

            <ul className="space-y-7 text-base">
              <li className="flex items-start gap-4">
                <Clock className="h-5 w-5 mt-0.5 text-gold-deep shrink-0" />
                <div>
                  <p className="eyebrow text-muted-foreground mb-1">Orari</p>
                  <p>Lun – Sab · {contacts.hours}</p>
                  <p className="text-sm text-muted-foreground mt-1">Su appuntamento consigliato</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="h-5 w-5 mt-0.5 text-gold-deep shrink-0" />
                <div>
                  <p className="eyebrow text-muted-foreground mb-1">Telefono</p>
                  <a href={contacts.phoneHref} className="underline-gold">{contacts.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="h-5 w-5 mt-0.5 text-gold-deep shrink-0" />
                <div>
                  <p className="eyebrow text-muted-foreground mb-1">Email</p>
                  <a href={contacts.emailHref} className="underline-gold">{contacts.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 mt-0.5 text-gold-deep shrink-0" />
                <div>
                  <p className="eyebrow text-muted-foreground mb-1">Come arrivare</p>
                  <p className="text-sm text-muted-foreground">Centro storico di Bari, a piedi dal Lungomare.</p>
                </div>
              </li>
            </ul>

            <div className="flex gap-5 mt-12">
              <a
                href={contacts.instagramHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-3 border border-ink/15 hover:border-gold-deep hover:text-gold-deep transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={contacts.facebookHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-3 border border-ink/15 hover:border-gold-deep hover:text-gold-deep transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={contacts.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 border border-ink/15 text-[11px] uppercase tracking-[0.24em] hover:border-gold-deep hover:text-gold-deep transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </Reveal>

          {/* RIGHT — form */}
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* WHAT TO BRING */}
      <section className="bg-bone-deep text-ink py-24 md:py-32 noise">
        <div className="container-cara">
          <div className="grid gap-10 md:grid-cols-12 mb-12">
            <div className="md:col-span-2">
              <p className="eyebrow text-gold-deep">§ Visita</p>
            </div>
            <Reveal as="h2" className="display-md md:col-span-9">
              Cosa portare al <em className="italic font-display text-gold-deep" style={{ fontStyle: "italic" }}>primo incontro</em>
            </Reveal>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { t: "Un'idea, anche vaga", b: "Una foto Pinterest, uno schizzo a matita, un ricordo. Da lì partiamo." },
              { t: "Un riferimento personale", b: "Un gioiello di famiglia, una pietra ereditata. Lo studiamo insieme." },
              { t: "Tempo", b: "L'appuntamento dura ~45 minuti. Senza fretta, senza obbligo di scelta." },
            ].map((x, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="border-t border-ink/15 pt-6">
                  <p className="font-display italic text-gold-deep text-2xl mb-4">— 0{i + 1}</p>
                  <h3 className="font-display text-2xl mb-3">{x.t}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{x.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="bg-obsidian">
        <div className="relative w-full h-[60vh] min-h-[400px]">
          <iframe
            src={contacts.mapEmbedSrc}
            title="Atelier Cara Preziosi — Bari"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full grayscale contrast-110 brightness-90"
            style={{ border: 0, filter: "grayscale(100%) contrast(1.1) brightness(0.85)" }}
          />
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // Estraggo il numero dal link wa.me già configurato in site.ts
    const waNumber = contacts.whatsappHref.replace(/\D/g, "");
    const lines = [
      `*Prenotazione visita — ${name || "—"}*`,
      "",
      `Nome: ${name || "—"}`,
      `Email: ${email || "—"}`,
      `Telefono: ${phone || "—"}`,
      "",
      "Messaggio:",
      message || "—",
    ];
    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${waNumber}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => setSending(false), 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="eyebrow text-gold-deep">Prenota una visita</p>
      <div className="grid gap-8 md:grid-cols-2">
        <Field name="name" label="Nome" required />
        <Field name="phone" label="Telefono" type="tel" />
      </div>
      <Field name="email" label="Email" type="email" required />
      <FieldTextarea name="message" label="Cosa hai in mente?" required />
      <button
        type="submit"
        disabled={sending}
        className="btn-primary group disabled:opacity-60"
      >
        {sending ? "Apertura WhatsApp…" : "Invia su WhatsApp"}
      </button>
      <p className="text-xs text-muted-foreground">
        Inviando il messaggio si aprirà WhatsApp con i tuoi dati già compilati,
        pronti per essere inviati all'atelier.
      </p>
    </form>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block group">
      <span className="eyebrow text-muted-foreground block mb-3">{label}{required && <span className="text-gold-deep">*</span>}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full bg-transparent border-b border-ink/20 py-3 text-base focus:outline-none focus:border-gold-deep transition-colors"
      />
    </label>
  );
}

function FieldTextarea({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="block group">
      <span className="eyebrow text-muted-foreground block mb-3">{label}{required && <span className="text-gold-deep">*</span>}</span>
      <textarea
        name={name}
        rows={5}
        required={required}
        className="w-full bg-transparent border-b border-ink/20 py-3 text-base focus:outline-none focus:border-gold-deep transition-colors resize-none"
      />
    </label>
  );
}
