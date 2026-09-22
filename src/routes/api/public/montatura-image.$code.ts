import { createFileRoute } from "@tanstack/react-router";
import { MONTATURA_IMAGES } from "@/lib/montatura-images";

export const Route = createFileRoute("/api/public/montatura-image/$code")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const pathname = new URL(request.url).pathname;
        const code = decodeURIComponent(pathname.split("/").pop() ?? "").toUpperCase();
        const image = MONTATURA_IMAGES[code];
        if (!image) return new Response("Not found", { status: 404 });

        if (image.startsWith("data:image/jpeg;base64,")) {
          const base64 = image.slice("data:image/jpeg;base64,".length);
          const binary = atob(base64);
          const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
          return new Response(bytes, {
            headers: {
              "Content-Type": "image/jpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }

        return Response.redirect(image, 302);
      },
    },
  },
});
