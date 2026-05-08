/**
 * Convert YouTube links in an HTML string into responsive iframe embeds.
 * - Supports `youtube.com/watch?v=...`, `youtu.be/...`, and already embedded URLs.
 * - Keeps attributes and classes consistent.
 *
 * @param {string} html - The input HTML string.
 * @param {object} [options] - Optional settings.
 * @param {number|string} [options.height=400] - iframe height.
 * @param {string} [options.className] - CSS classes for the iframe.
 * @returns {string} - The transformed HTML with YouTube links replaced by iframes.
 */
export const convertYouTubeLinksToEmbed = (html, options = {}) => {
  const { height = 400, className = "rounded-xl my-6 shadow-md w-full aspect-video" } = options;

  // Use DOMParser to avoid relying on a temporary element attached to document
  const parser = new DOMParser();
  const doc = parser.parseFromString(html || "", "text/html");

  const anchors = Array.from(doc.querySelectorAll("a[href]")).filter(Boolean);

  const DEFAULT_ALLOW =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

  const getYouTubeVideoId = (url) => {
    if (!url || typeof url !== "string") return null;

    // Normalize URL for easier matching
    const normalized = url.trim();

    // Patterns to capture the 11-char YouTube ID
    const patterns = [
      /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/, // embed urls
      /(?:youtube\.com\/watch\?v=|youtube\.com\/v\/|youtu\.be\/)([A-Za-z0-9_-]{11})/, // watch, v, short
      /[?&]v=([A-Za-z0-9_-]{11})/, // catch query param anywhere
    ];

    for (const re of patterns) {
      const m = normalized.match(re);
      if (m && m[1]) return m[1];
    }
    return null;
  };

  const isEmbedUrl = (url) => /youtube\.com\/embed\//i.test(url);

  const createIframe = (src) => {
    const iframe = doc.createElement("iframe");
    iframe.setAttribute("src", src);
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", String(height));
    iframe.setAttribute("allow", DEFAULT_ALLOW);
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    iframe.setAttribute("allowfullscreen", "");
    iframe.className = className;
    return iframe;
  };

  anchors.forEach((a) => {
    const href = a.getAttribute("href") || "";
    // If anchor is already an iframe wrapper or empty, skip
    if (!href) return;

    // If it's already an embed URL, use it directly
    if (isEmbedUrl(href)) {
      try {
        const iframe = createIframe(href);
        a.replaceWith(iframe);
      } catch (e) {
        // ignore and leave link as-is
      }
      return;
    }

    const id = getYouTubeVideoId(href);
    if (id) {
      const src = `https://www.youtube.com/embed/${id}`;
      try {
        const iframe = createIframe(src);
        a.replaceWith(iframe);
      } catch (e) {
        // ignore failure and keep original link
      }
    }
  });

  return doc.body.innerHTML;
};
