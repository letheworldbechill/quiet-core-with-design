import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

export function useMarkdown(content: string, enabled: boolean): string {
  return useMemo(() => {
    if (!enabled || !content) {
      return content;
    }

    try {
      const rawHtml = marked.parse(content) as string;
      // Sanitize HTML to prevent XSS
      return DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          "h1", "h2", "h3", "h4", "h5", "h6",
          "p", "br", "hr",
          "ul", "ol", "li",
          "strong", "em", "b", "i", "u", "s",
          "a", "img",
          "blockquote", "pre", "code",
          "table", "thead", "tbody", "tr", "th", "td",
          "div", "span",
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel"],
      });
    } catch {
      return content;
    }
  }, [content, enabled]);
}

export function parseMarkdown(content: string): string {
  try {
    const rawHtml = marked.parse(content) as string;
    return DOMPurify.sanitize(rawHtml);
  } catch {
    return content;
  }
}
