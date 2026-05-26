## Problema

Sul mobile, cliccando l'hamburger il menù appare come una striscia blu sottile in alto con solo la X visibile: lo sfondo non copre il viewport, i link di navigazione sono compressi e dietro si vedono la hero e il cookie modal.

## Causa

Il pannello del menù è dentro `<header>` (`SiteHeader.tsx`, righe 90–154) con `fixed inset-0`. L'`<header>` usa `backdrop-blur-xl` (riga 26–27). Per specifica CSS, `backdrop-filter` diverso da `none` crea un *containing block* per i discendenti `position: fixed`. Risultato: il menù non si ancora più al viewport ma all'header, che è alto solo ~70px.

## Fix

Renderizzare il pannello mobile fuori dall'header tramite `createPortal` su `document.body`, così sfugge al containing block dell'header e torna a coprire l'intero viewport.

### Modifiche a `src/components/layout/SiteHeader.tsx`

1. Importare `createPortal` da `react-dom`.
2. Aggiungere uno stato `mounted` (true dopo il primo `useEffect`) per evitare problemi in SSR/prima idratazione.
3. Estrarre il blocco `Mobile fullscreen takeover` (righe 89–154) e renderlo via `createPortal(panel, document.body)` solo quando `mounted` è true.
4. Lasciare invariato il bottone hamburger dentro l'header e tutta la logica di `open`/`setOpen`/lock scroll.
5. Verificare che il pannello mantenga: sfondo blu pieno (`oklch(0.215 0.130 265)`), X in alto a destra, nav links da `navigation` con stati attivi, blocco contatti/atelier/social in basso. Niente cambi di contenuto né di stile, solo riposizionamento DOM via portal.

### Verifica

- Aprire il preview mobile a 390×844.
- Cliccare l'hamburger: il pannello deve coprire tutto lo schermo, sfondo blu solido, link leggibili in bianco/oro, X chiude correttamente.
- Cliccare un link: chiude il menù e naviga.
- Riaprire scroll del body dopo chiusura (già gestito dall'effetto esistente).
- Controllare che desktop ≥ lg non sia toccato (la `lg:hidden` rimane sul wrapper portalizzato).
