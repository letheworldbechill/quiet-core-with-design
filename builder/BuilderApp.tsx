import { useState, useCallback, useEffect } from "react";
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
import { generateCSS } from "../design-system";

type Screen = "content" | "design" | "publish";

const STORAGE_KEY = "quiet-builder-site";

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function loadFromStorage(): SiteContent | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SiteContent;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveToStorage(site: SiteContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
  } catch {
    // Ignore storage errors
  }
}

export function BuilderApp() {
  const [screen, setScreen] = useState<Screen>("content");
  const [site, setSite] = useState<SiteContent>(() => {
    const stored = loadFromStorage();
    return stored || createEmptySiteContent(generateId(), "en", now());
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    saveToStorage(site);
  }, [site]);

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

    // Inject CSS into the first page for preview
    const css = generateCSS();
    const firstPage = artifacts[0].content;
    const withCss = firstPage.replace(
      "</head>",
      `<style>\n${css}\n</style>\n</head>`
    );
    setPreviewHtml(withCss);
  }, [validateAndBuild]);

  const downloadSite = useCallback(() => {
    const artifacts = validateAndBuild();
    if (!artifacts) return;

    const css = generateCSS();

    // Create a complete HTML file with all pages and CSS
    const fullHtml = artifacts.map((a) => {
      // Inject CSS into each page
      return a.content.replace(
        "</head>",
        `<style>\n${css}\n</style>\n</head>`
      );
    }).join("\n\n<!-- ========== NEXT PAGE ========== -->\n\n");

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${site.seo.title || "website"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus({ type: "success", message: "Download gestartet!" });
  }, [site, validateAndBuild]);

  const downloadAsZipSimulated = useCallback(() => {
    const artifacts = validateAndBuild();
    if (!artifacts) return;

    const css = generateCSS();

    // Create a single file with all pages separated by comments
    const combined = [
      `/* ========== styles.css ========== */\n${css}`,
      ...artifacts.map((a) => `\n\n/* ========== ${a.path} ========== */\n${a.content.replace(
        "</head>",
        `<link rel="stylesheet" href="styles.css">\n</head>`
      )}`)
    ].join("\n");

    const blob = new Blob([combined], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${site.seo.title || "website"}-bundle.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus({ type: "success", message: `Bundle mit ${artifacts.length} Seite(n) + CSS heruntergeladen!` });
  }, [site, validateAndBuild]);

  const resetSite = useCallback(() => {
    if (confirm("Alle Daten löschen und neu beginnen?")) {
      const newSite = createEmptySiteContent(generateId(), site.locale, now());
      setSite(newSite);
      setCurrentPageIndex(0);
      setPreviewHtml(null);
      setStatus({ type: "info", message: "Projekt zurückgesetzt" });
    }
  }, [site.locale]);

  const changeLocale = useCallback((locale: Locale) => {
    updateSite({ locale });
  }, [updateSite]);

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
                <label>Slug</label>
                <input
                  type="text"
                  value={currentPage.slug}
                  onChange={(e) => updatePage({ slug: e.target.value })}
                  placeholder="z.B. home, about, contact"
                />
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
              </div>
            </>
          )}

          <div className="form-group">
            <label>SEO Titel</label>
            <input
              type="text"
              value={site.seo.title}
              onChange={(e) => updateSite({ seo: { ...site.seo, title: e.target.value } })}
              placeholder="Website-Titel für Suchmaschinen"
            />
          </div>

          <div className="form-group">
            <label>SEO Beschreibung</label>
            <textarea
              value={site.seo.description}
              onChange={(e) => updateSite({ seo: { ...site.seo, description: e.target.value } })}
              placeholder="Kurze Beschreibung für Suchmaschinen"
              style={{ minHeight: "80px" }}
            />
          </div>

          {status && <div className={`status ${status.type}`}>{status.message}</div>}
        </div>
      )}

      {screen === "design" && (
        <div className="screen">
          <h2>Design System</h2>
          <p className="info-text">
            Das Design System ist eingefroren (🧊) und verwendet vordefinierte Tokens.
          </p>

          <div className="form-group">
            <label>Farbpalette</label>
            <div className="preview-box">
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {[
                  { name: "base", label: "Basis" },
                  { name: "structure", label: "Struktur" },
                  { name: "context", label: "Kontext" },
                  { name: "intent", label: "Absicht" },
                  { name: "action", label: "Aktion" },
                  { name: "final", label: "Final" },
                ].map(({ name, label }) => (
                  <div
                    key={name}
                    style={{
                      width: "80px",
                      height: "50px",
                      background: `var(--${name})`,
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "0.25rem",
                      fontSize: "0.65rem",
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Textfarben</label>
            <div className="preview-box">
              <p style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>Text Main - Haupttext</p>
              <p style={{ color: "var(--text-soft)", marginBottom: "0.5rem" }}>Text Soft - Sekundärtext</p>
              <p style={{ color: "var(--text-muted)" }}>Text Muted - Gedämpfter Text</p>
            </div>
          </div>

          <div className="form-group">
            <label>Typografie</label>
            <div className="preview-box">
              <p><strong>Maximale Zeilenlänge:</strong> 75ch</p>
              <p><strong>Section Padding:</strong> 4rem × 3rem</p>
              <p><strong>Gap:</strong> 2rem (Section) / 1.5rem (Slot)</p>
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
            </div>
          </div>

          <div className="form-group">
            <label>Status ändern</label>
            <div className="actions">
              {site.state === "draft" && (
                <button className="btn" onClick={() => handleTransition("review")}>
                  Zur Prüfung
                </button>
              )}
              {site.state === "review" && (
                <>
                  <button className="btn btn-secondary" onClick={() => handleTransition("draft")}>
                    Zurück zu Entwurf
                  </button>
                  <button className="btn" onClick={() => handleTransition("published")}>
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
              <button className="btn" onClick={downloadSite}>
                HTML herunterladen
              </button>
              <button className="btn btn-secondary" onClick={downloadAsZipSimulated}>
                Bundle herunterladen
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
            </p>
          </div>

          <div className="preview-box" style={{ marginTop: "1.5rem" }}>
            <p><strong>Rohdaten (JSON):</strong></p>
            <pre style={{ fontSize: "0.75rem" }}>{JSON.stringify(site, null, 2)}</pre>
          </div>

          {status && <div className={`status ${status.type}`}>{status.message}</div>}
        </div>
      )}
    </div>
  );
}
