import { VERETTE_IMAGES } from "@/lib/montatura-images-verette";
import { PENDENTI_IMAGES } from "@/lib/montatura-images-pendenti";
import { ORECCHINI_IMAGES } from "@/lib/montatura-images-orecchini";

/** Immagini catalogo: fotografie Nivoda per gli anelli, asset editoriali dedicati per le altre categorie. */
export const MONTATURA_IMAGES: Record<string, string> = {
  ...VERETTE_IMAGES,
  ...PENDENTI_IMAGES,
  ...ORECCHINI_IMAGES,
  "SOL-CL": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XKV6B0L1M4Z.jpg?v=1",
  "SOL-CATT": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YU8360L1M4Z.jpg?v=1",
  "SOL-DOP": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XTYJV0L1M4Z.jpg?v=1",
  "SOL-NAS": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5ZEDVB0L1M4Z.jpg?v=1",
  "SOL-INT": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5X31XG0L1M4Z.jpg?v=1",
  "SOL-SEI": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XLIBV0L1M4Z.jpg?v=1",
  "SOL-VINT": "https://image25.thepersonalizedbest.com/image/api_image61/6FUCU51YQ0L1M4Z.jpg?v=1",
  "SOL-VAL": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YWGFQ0L1M4Z.jpg?v=1",
  "SOL-CAT": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ83YKIV0L1M4Z.jpg?v=1",
  "SOL-TEN": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YEBNB0L1M4Z.jpg?v=1",
  "HALO-CL": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XNBSL0L1M4Z.jpg?v=1",
  "HALO-CUS": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YOLC60L1M4Z.jpg?v=1",
  "HALO-DOP": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XNWX60L1M4Z.jpg?v=1",
  "HALO-FIO": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XRJWL0L1M4Z.jpg?v=1",
  "PAVE-GAM": "https://image25.thepersonalizedbest.com/image/api_image61/6FRDPMJBB0L1M4Z.jpg?v=1",
  "PAVE-MET": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ82E57B0L1M4Z.jpg?v=1",
  "PAVE-TOR": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ82WOSG0L1M4Z.jpg?v=1",
  "TRIL-CL": "https://image25.thepersonalizedbest.com/image/api_image61/6FRB8EDXQ0L1M4Z.jpg?v=1",
  "TRE-CAT": "https://image25.thepersonalizedbest.com/image/api_image61/6FRANAU510L1M4Z.jpg?v=1",
  "TRIL-BAG": "https://image25.thepersonalizedbest.com/image/api_image61/6FQ7ICWYB0L1M4Z.jpg?v=1",
};

export function getMontaturaImage(code: string, databaseImage?: string | null): string {
  return databaseImage || MONTATURA_IMAGES[code] || "";
}
