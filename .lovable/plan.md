## Stato attuale

1. **Runtime error AtelierServicesPinned.tsx:152** → è **stale**. Il file attuale a riga 152 è JSX valido (`className="absolute inset-x-0 top-[18%]..."`) e l'ultimo `npm run build` è passato (exit 0). L'errore arriva da un salvataggio rotto precedente non più presente. Si risolve con un refresh del dev server.

2. **JewelGenesisSection ("Come nasce un gioiello")** → testo che compare in ritardo durante lo scroll. Attuale trigger `top 95%` con `from()` GSAP: il problema strutturale è che `from()` parte da `autoAlpha: 0` quindi se lo ScrollTrigger non si attiva immediatamente (o l'utente scrolla veloce) il testo resta invisibile per qualche frame.

3. **AtelierServicesPinned (servizi atelier)** → da non toccare, come richiesto.

4. **PinnedProcess** → modificato in precedenza con `startTime = i - 0.6` che può creare valori negativi nella timeline (RangeError potenziale). Da verificare.

## Piano di intervento

### Fix 1 — Eliminare definitivamente l'errore stale
- Restart del dev server per scaricare la cache esbuild dell'errore fantasma su `AtelierServicesPinned.tsx:152`.
- Nessuna modifica al file (è già corretto).

### Fix 2 — JewelGenesisSection: animazione anticipata o disattivata
**Opzione consigliata**: rimuovere completamente l'animazione `from()` su questa sezione. Il testo sarà sempre visibile, niente ritardi possibili, nessun rischio di blank-state. La sezione mantiene il connettore dorato verticale (`data-genesis-rail`) che è puramente decorativo.

Tecnicamente: cancello il blocco `gsap.utils.toArray("[data-genesis-step]").forEach(...)` dentro `useEffect`. Tengo solo il draw del rail dorato.

### Fix 3 — PinnedProcess: stabilizzare timeline
- Riporto `startTime = i` (no offset negativo) per evitare RangeError quando GSAP normalizza la timeline.
- Mantengo `scrub: 0.5` per reattività.

### Fix 4 — Verifica finale
- `npm run build` per confermare zero errori TS.
- Navigazione browser su `/`, scroll fino a "Come nasce un gioiello" → verifico che il testo sia subito visibile.
- Scroll fino a PinnedProcess → verifico crossfade fluido.
- Scroll fino ad AtelierServicesPinned → verifico che la sezione (non toccata) funzioni come prima.

## Dettagli tecnici

**File modificati**:
- `src/routes/index.tsx` — funzione `JewelGenesisSection`, rimozione blocco animazione step (mantengo solo rail draw)
- `src/components/motion/PinnedProcess.tsx` — ripristino `startTime = i`

**File NON toccati**:
- `src/components/motion/AtelierServicesPinned.tsx` (esplicitamente escluso dall'utente)

**Rischio**: minimo. Sto rimuovendo animazioni problematiche, non aggiungendo logica nuova. Niente refactor, niente cambio layout, niente cambio copy.

## Conferma necessaria

Procedo con:
- **Rimozione totale animazione "Come nasce un gioiello"** (testo sempre visibile, niente fade-in)?
- O preferisci **mantenere un fade-in istantaneo** (0.2s) come compromesso?