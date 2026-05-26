import { openCookiePreferences } from "@/lib/cookie-consent/ConsentProvider";

interface Props {
  className?: string;
  label?: string;
}

/** Link persistente per riaprire il pannello preferenze cookie. */
export function CookiePreferencesLink({
  className = "text-bone/70 hover:text-gold transition-colors underline-gold",
  label = "Rivedi preferenze cookie",
}: Props) {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className={className}
    >
      {label}
    </button>
  );
}
