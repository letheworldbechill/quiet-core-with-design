import { useState } from "react";
import type { Translations } from "../i18n";

type ViewportSize = "desktop" | "tablet" | "mobile";

type ResponsivePreviewProps = {
  html: string;
  t: Translations;
};

const VIEWPORT_SIZES: Record<ViewportSize, { width: number; height: number }> = {
  desktop: { width: 1200, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

export function ResponsivePreview({ html, t }: ResponsivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const size = VIEWPORT_SIZES[viewport];

  // Calculate scale to fit in container
  const containerWidth = 800;
  const scale = Math.min(1, containerWidth / size.width);

  return (
    <div className="responsive-preview">
      <div className="viewport-selector">
        <span>{t.publish.responsive}:</span>
        <button
          className={`viewport-btn ${viewport === "desktop" ? "active" : ""}`}
          onClick={() => setViewport("desktop")}
          title={t.publish.desktop}
        >
          🖥️
        </button>
        <button
          className={`viewport-btn ${viewport === "tablet" ? "active" : ""}`}
          onClick={() => setViewport("tablet")}
          title={t.publish.tablet}
        >
          📱
        </button>
        <button
          className={`viewport-btn ${viewport === "mobile" ? "active" : ""}`}
          onClick={() => setViewport("mobile")}
          title={t.publish.mobile}
        >
          📲
        </button>
        <span className="viewport-size">
          {size.width} × {size.height}
        </span>
      </div>

      <div
        className="preview-container"
        style={{
          width: `${size.width * scale}px`,
          height: `${Math.min(400, size.height * scale)}px`,
          margin: "0 auto",
        }}
      >
        <iframe
          srcDoc={html}
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: "1px solid var(--context)",
            borderRadius: "4px",
            background: "white",
          }}
          title="Preview"
        />
      </div>
    </div>
  );
}
