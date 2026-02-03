import { useState, useCallback, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  validateSiteContent,
  renderSiteContent,
  canTransition,
  transitionState,
  createEmptySiteContent,
  type SiteContent,
  type Page,
  type ContentState,
  type Locale,
} from "../core";
import { generateCSS, renderPageLayout, type PageLayout } from "../design-system";
import { useValidation, useImages, type UploadedImage } from "./hooks";
import { SectionEditor, ImageUploader, ValidationDisplay } from "./components";

type Screen = "content" | "design" | "publish";

const STORAGE_KEY = "quiet-builder-site";
const IMAGES_KEY = "quiet-builder-images";
const LAYOUT_KEY = "quiet-builder-layout";

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function loadFromStorage<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

const defaultLayout: PageLayout = {
  sections: [
    {
      decl: "a",
      grid: "a",
      slots: [
        { type: "primary", content: "Willkommen" },
        { type: "secondary", content: "Deine Seite beginnt hier." },
      ],
    },
  ],
};

export function BuilderApp() {
  const [screen, setScreen] = useState<Screen>("content");
  const [site, setSite] = useState<SiteContent>(() => {
    const stored = loadFromStorage<SiteContent>(STORAGE_KEY);
    return stored || createEmptySiteContent(generateId(), "en", now());
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [pageLayout, setPageLayout] = useState<PageLayout>(() => {
    return loadFromStorage<PageLayout>(LAYOUT_KEY) || defaultLayout;
  });

  const validation = useValidation(site);
  const imageStore = useImages(loadFromStorage<UploadedImage[]>(IMAGES_KEY) || []);

  // Auto-save to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEY, site);
  }, [site]);

  useEffect(() => {
    saveToStorage(IMAGES_KEY, imageStore.images);
  }, [imageStore.images]);

  useEffect(() => {
    saveToStorage(LAYOUT_KEY, pageLayout);
  }, [pageLayout]);

  const currentPage = site.pages[currentPageIndex];

  const updateSite = useCallback((updates: Partial<SiteContent>) => {
    setSite((prev) => ({
      ...prev,
      ...updates,
      updatedAt: now(),
    }));
    setStatus(null);
    setPreviewHtml(null);
  }, []);

  const updatePage = useCallback((pageUpdates: Partial<Page>) => {
    setSite((prev) => ({
      ...prev,
      updatedAt: now(),
      pages: prev.pages.map((p, i) =>
        i === currentPageIndex ? { ...p, ...pageUpdates } : p
      ),
    }));
    setStatus(null);
    setPreviewHtml(null);
  }, [currentPageIndex]);

  const addPage = useCallback(() => {
    const pageNum = site.pages.length + 1;
    const newPage: Page = {
      slug: `page-${pageNum}`,
      title: `Neue Seite ${pageNum}`,
      body: "",
    };
    setSite((prev) => ({
      ...prev,
      updatedAt: now(),
      pages: [...prev.pages, newPage],
    }));
    setCurrentPageIndex(site.pages.length);
  }, [site.pages.length]);

  const deletePage = useCallback((index: number) => {
    if (site.pages.length <= 1) {
      setStatus({ type: "error", message: "Mindestens eine Seite erforderlich" });
      return;
    }
    setSite((prev) => ({
      ...prev,
      updatedAt: now(),
      pages: prev.pages.filter((_, i) => i !== index),
    }));
    if (currentPageIndex >= index && currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  }, [site.pages.length, currentPageIndex]);

  const handleTransition = useCallback((targetState: ContentState) => {
    if (!canTransition(site.state, targetState)) {
      setStatus({ type: "error", message: `Übergang zu "${targetState}" nicht erlaubt` });
      return;
    }
    try {
      const newState = transitionState(site.state, targetState);
      updateSite({ state: newState });
      setStatus({ type: "success", message: `Status geändert zu: ${newState}` });
    } catch (e) {
      setStatus({ type: "error", message: (e as Error).message });
    }
  }, [site.state, updateSite]);

  const validateAndBuild = useCallback(() => {
    try {
      validateSiteContent(site);
      const artifacts = renderSiteContent(site);
      setStatus({ type: "success", message: `Validierung erfolgreich! ${artifacts.length} Seite(n) generiert.` });
      return artifacts;
    } catch (e) {
      setStatus({ type: "error", message: (e as Error).message });
      return null;
    }
  }, [site]);

  const generatePreview = useCallback(() => {
    const artifacts = validateAndBuild();
    if (!artifacts || artifacts.length === 0) return;

    const css = generateCSS();
    const firstPage = artifacts[0].content;
    const withCss = firstPage.replace(
      "</head>",
      `<style>\n${css}\n</style>\n</head>`
    );
    setPreviewHtml(withCss);
  }, [validateAndBuild]);

  const downloadAsZip = useCallback(async () => {
    const artifacts = validateAndBuild();
    if (!artifacts) return;

    const css = generateCSS();
    const zip = new JSZip();

    // Add CSS file
    zip.file("styles.css", css);

    // Add HTML files with CSS link
    artifacts.forEach((artifact) => {
      const htmlWithCssLink = artifact.content.replace(
        "</head>",
        `  <link rel="stylesheet" href="styles.css">\n</head>`
      );
      zip.file(artifact.path, htmlWithCssLink);
    });

    // Add images folder
    if (imageStore.images.length > 0) {
      const imagesFolder = zip.folder("images");
      if (imagesFolder) {
        for (const image of imageStore.images) {
          // Convert data URL to blob
          const base64Data = image.dataUrl.split(",")[1];
          imagesFolder.file(image.name, base64Data, { base64: true });
        }
      }
    }

    // Generate ZIP and download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${site.seo.title || "website"}.zip`);

    setStatus({ type: "success", message: `ZIP mit ${artifacts.length} Seite(n), CSS und ${imageStore.images.length} Bild(ern) heruntergeladen!` });
  }, [site, validateAndBuild, imageStore.images]);

  const resetSite = useCallback(() => {
    if (confirm("Alle Daten löschen und neu beginnen?")) {
      const newSite = createEmptySiteContent(generateId(), site.locale, now());
      setSite(newSite);
      setCurrentPageIndex(0);
      setPreviewHtml(null);
      setPageLayout(defaultLayout);
      imageStore.clearAll();
      setStatus({ type: "info", message: "Projekt zurückgesetzt" });
    }
  }, [site.locale, imageStore]);

  const changeLocale = useCallback((locale: Locale) => {
    updateSite({ locale });
  }, [updateSite]);

  const applyLayoutToPage = useCallback(() => {
    try {
      const rendered = renderPageLayout(pageLayout);
      updatePage({ body: rendered.html });
      setStatus({ type: "success", message: "Layout auf aktuelle Seite angewendet!" });
    } catch (e) {
      setStatus({ type: "error", message: (e as Error).message });
    }
  }, [pageLayout, updatePage]);

  return (
    <div className="builder">
      <header className="header">
        <h1>🧊 Quiet Builder</h1>
        <nav className="nav">
          <button
            className={`nav-btn ${screen === "content" ? "active" : ""}`}
            onClick={() => setScreen("content")}
          >
            Inhalt
          </button>
          <button
            className={`nav-btn ${screen === "design" ? "active" : ""}`}
            onClick={() => setScreen("design")}
          >
            Design
          </button>
          <button
            className={`nav-btn ${screen === "publish" ? "active" : ""}`}
            onClick={() => setScreen("publish")}
          >
            Veröffentlichen
          </button>
        </nav>
      </header>

      <ValidationDisplay validation={validation} showWarnings={screen === "content"} />

      {screen === "content" && (
        <div className="screen">
          <h2>Inhalt bearbeiten</h2>

          <div className="form-group">
            <label>Sprache</label>
            <select
              value={site.locale}
              onChange={(e) => changeLocale(e.target.value as Locale)}
            >
              <option value="en">English</option>
              <option value="pt-BR">Português (Brasil)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Seiten</label>
            <ul className="page-list">
              {site.pages.map((page, index) => (
                <li
                  key={`${page.slug}-${index}`}
                  className={`page-item ${index === currentPageIndex ? "active" : ""}`}
                  onClick={() => setCurrentPageIndex(index)}
                >
                  <span>{page.title || page.slug}</span>
                  <button onClick={(e) => { e.stopPropagation(); deletePage(index); }}>✕</button>
                </li>
              ))}
            </ul>
            <button className="btn btn-secondary" onClick={addPage}>
              + Seite hinzufügen
            </button>
          </div>

          {currentPage && (
            <>
              <div className="form-group">
                <label>
                  Slug
                  {currentPage.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(currentPage.slug) && (
                    <span className="field-error"> ⚠️ Ungültiges Format</span>
                  )}
                </label>
                <input
                  type="text"
                  value={currentPage.slug}
                  onChange={(e) => updatePage({ slug: e.target.value.toLowerCase() })}
                  placeholder="z.B. home, about, contact"
                />
                <small>Nur Kleinbuchstaben, Zahlen und Bindestriche</small>
              </div>

              <div className="form-group">
                <label>Titel</label>
                <input
                  type="text"
                  value={currentPage.title}
                  onChange={(e) => updatePage({ title: e.target.value })}
                  placeholder="Seitentitel"
                />
              </div>

              <div className="form-group">
                <label>Inhalt (HTML)</label>
                <textarea
                  value={currentPage.body}
                  onChange={(e) => updatePage({ body: e.target.value })}
                  placeholder="<p>Dein Inhalt hier...</p>"
                />
                <div className="actions" style={{ marginTop: "0.5rem" }}>
                  <button className="btn btn-secondary btn-small" onClick={applyLayoutToPage}>
                    Design-Layout anwenden
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>
              SEO Titel
              <span className="char-count">{site.seo.title.length}/60</span>
            </label>
            <input
              type="text"
              value={site.seo.title}
              onChange={(e) => updateSite({ seo: { ...site.seo, title: e.target.value } })}
              placeholder="Website-Titel für Suchmaschinen"
              className={site.seo.title.length > 60 ? "input-warning" : ""}
            />
          </div>

          <div className="form-group">
            <label>
              SEO Beschreibung
              <span className="char-count">{site.seo.description.length}/160</span>
            </label>
            <textarea
              value={site.seo.description}
              onChange={(e) => updateSite({ seo: { ...site.seo, description: e.target.value } })}
              placeholder="Kurze Beschreibung für Suchmaschinen"
              style={{ minHeight: "80px" }}
              className={site.seo.description.length > 160 ? "input-warning" : ""}
            />
          </div>

          <div className="form-group">
            <label>Bilder</label>
            <ImageUploader
              images={imageStore.images}
              onAdd={imageStore.addImage}
              onRemove={imageStore.removeImage}
              error={imageStore.error}
              onClearError={imageStore.clearError}
            />
          </div>

          {status && <div className={`status ${status.type}`}>{status.message}</div>}
        </div>
      )}

      {screen === "design" && (
        <div className="screen">
          <h2>Design System</h2>
          <p className="info-text">
            Erstelle Sections mit dem eingefrorenen Design System.
            Klicke "Layout anwenden" auf der Inhalt-Seite.
          </p>

          <SectionEditor layout={pageLayout} onChange={setPageLayout} />

          <div className="download-section" style={{ marginTop: "1.5rem" }}>
            <h3>Farbpalette (🧊 eingefroren)</h3>
            <div className="preview-box">
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {[
                  { name: "base", hex: "#0B2839" },
                  { name: "structure", hex: "#10475E" },
                  { name: "context", hex: "#3D717E" },
                  { name: "intent", hex: "#D68631" },
                  { name: "action", hex: "#964405" },
                  { name: "final", hex: "#5A3211" },
                ].map(({ name, hex }) => (
                  <div
                    key={name}
                    style={{
                      width: "80px",
                      height: "50px",
                      background: hex,
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "0.25rem",
                      fontSize: "0.6rem",
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {status && <div className={`status ${status.type}`}>{status.message}</div>}
        </div>
      )}

      {screen === "publish" && (
        <div className="screen">
          <h2>Veröffentlichen</h2>

          <div className="form-group">
            <label>Aktueller Status</label>
            <div>
              <span className={`state-badge ${site.state}`}>{site.state}</span>
              {!validation.isValid && (
                <span className="state-warning"> ⚠️ Validierungsfehler vorhanden</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Status ändern</label>
            <div className="actions">
              {site.state === "draft" && (
                <button
                  className="btn"
                  onClick={() => handleTransition("review")}
                  disabled={!validation.isValid}
                >
                  Zur Prüfung
                </button>
              )}
              {site.state === "review" && (
                <>
                  <button className="btn btn-secondary" onClick={() => handleTransition("draft")}>
                    Zurück zu Entwurf
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleTransition("published")}
                    disabled={!validation.isValid}
                  >
                    Veröffentlichen
                  </button>
                </>
              )}
              {site.state === "published" && (
                <button className="btn btn-secondary" onClick={() => handleTransition("archived")}>
                  Archivieren
                </button>
              )}
              {site.state === "archived" && (
                <p className="info-text">Archivierte Inhalte können nicht mehr geändert werden.</p>
              )}
            </div>
          </div>

          <div className="download-section">
            <h3 style={{ marginBottom: "1rem" }}>Vorschau & Download</h3>
            <div className="actions">
              <button className="btn btn-secondary" onClick={generatePreview}>
                Vorschau generieren
              </button>
              <button className="btn" onClick={downloadAsZip} disabled={!validation.isValid}>
                📦 Als ZIP herunterladen
              </button>
            </div>

            {previewHtml && (
              <div className="preview-box" style={{ marginTop: "1rem" }}>
                <p><strong>Live-Vorschau:</strong></p>
                <iframe
                  srcDoc={previewHtml}
                  style={{
                    width: "100%",
                    height: "300px",
                    border: "1px solid var(--context)",
                    borderRadius: "4px",
                    marginTop: "0.5rem",
                  }}
                  title="Preview"
                />
              </div>
            )}
          </div>

          <div className="download-section">
            <h3 style={{ marginBottom: "1rem" }}>Projekt</h3>
            <div className="actions">
              <button className="btn btn-secondary" onClick={resetSite}>
                Projekt zurücksetzen
              </button>
            </div>
            <p className="info-text" style={{ marginTop: "0.5rem" }}>
              Daten werden automatisch im Browser gespeichert.
              {imageStore.images.length > 0 && ` (${imageStore.images.length} Bilder)`}
            </p>
          </div>

          {status && <div className={`status ${status.type}`}>{status.message}</div>}
        </div>
      )}
    </div>
  );
}
