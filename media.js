import { readMedia } from "./lib/store.js";

export default async (request) => {
  const key = decodeURIComponent(new URL(request.url).pathname.split("/").pop() || "");
  const media = await readMedia(key);
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(media.bytes, {
    headers: {
      "Content-Type": media.type,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
};
