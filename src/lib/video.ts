// Converte um link de vídeo (YouTube, Vimeo ou Google Drive) no endereço do player embutido.
// Retorna null quando o link não é reconhecido.
export function toEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    const m = url.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/);
    return m ? `https://www.youtube.com/embed/${m[2]}` : null;
  }

  if (host === "vimeo.com") {
    const m = url.pathname.match(/^\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
    if (!m) return null;
    return `https://player.vimeo.com/video/${m[1]}${m[2] ? `?h=${m[2]}` : ""}`;
  }

  if (host === "player.vimeo.com" && /^\/video\/\d+/.test(url.pathname)) {
    return url.toString();
  }

  if (host === "drive.google.com") {
    const m = url.pathname.match(/\/file\/d\/([^/]+)/);
    return m ? `https://drive.google.com/file/d/${m[1]}/preview` : null;
  }

  return null;
}
