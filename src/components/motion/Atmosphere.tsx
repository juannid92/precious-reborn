/**
 * Atmosphere — fondali globali, fissati al viewport, sotto a tutto.
 * Crea profondità cromatica continua su tutto il sito senza toccare
 * la struttura delle route. Pure CSS / pointer-events: none / SSR-safe.
 */
export function Atmosphere() {
  return (
    <div className="atmosphere-root" aria-hidden="true">
      <div className="atmosphere-field" />
      <div className="atmosphere-pools" />
      <div className="atmosphere-rails" />
      <div className="atmosphere-vignette" />
      <div className="atmosphere-grain" />
    </div>
  );
}
