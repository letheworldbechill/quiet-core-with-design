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
import { useValidation, useImages, useMarkdown, parseMarkdown, type UploadedImage } from "./hooks";
import {
  SectionEditor,
  ImageUploader,
  ValidationDisplay,
  ResponsivePreview,
  JsonImportExport,
} from "./components";
import { translations, type UILocale, type Translations } from "./i18n";

type Screen = "content" | "design" | "publish";

const STORAGE_KEY = "quiet-builder-site";
const IMAGES_KEY = "quiet-builder-images";
const LAYOUT_KEY = "quiet-builder-layout";
const UI_LOCALE_KEY = "quiet-builder-ui-locale";
const MARKDOWN_KEY = "quiet-builder-use-markdown";

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
        { type: "primary", content: "Welcome" },
        { type: "secondary", content: "Your page starts here." },
      ],
    },
  ],
};

export function BuilderApp() {
  // UI Language
  const [uiLocale, setUiLocale] = useState<UILocale>(() => {
    const stored = localStorage.getItem(UI_LOCALE_KEY);
    return (stored === "en" || stored === "de") ? stored : "de";
  });
  const t: Translations = translations[uiLocale];

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
  const [useMarkdownMode, setUseMarkdownMode] = useState(() => {
    return loadFromStorage<boolean>(MARKDOWN_KEY) ?? false;
  });

  const validation = useValidation(site);
  const imageStore = useImages(loadFromStorage<UploadedImage[]>(IMAGES_KEY) || []);

  const currentPage = site.pages[currentPageIndex];
  const processedBody = useMarkdown(currentPage?.body || "", useMarkdownMode);

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

  useEffect(() => {
    localStorage.setItem(UI_LOCALE_KEY, uiLocale);
  }, [uiLocale]);

  useEffect(() => {
    saveToStorage(MARKDOWN_KEY, useMarkdownMode);
  }, [useMarkdownMode]);

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
      title: `${uiLocale === "de" ? "Neue Seite" : "New Page"} ${pageNum}`,
      body: "",
    };
    setSite((prev) => ({
      ...prev,
      updatedAt: now(),
      pages: [...prev.pages, newPage],
    }));
    setCurrentPageIndex(site.pages.length);
  }, [site.pages.length, uiLocale]);

  const deletePage = useCallback((index: number) => {
    if (site.pages.length <= 1) {
      setStatus({ type: "error", message: t.common.minOnePage });
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
  }, [site.pages.length, currentPageIndex, t]);

  const handleTransition = useCallback((targetState: ContentState) => {
    if (!canTransition(site.state, targetState)) {
      setStatus({ type: "error", message: `Transition to "${targetState}" not allowed` });
      return;
    }
    try {
      const newState = transitionState(site.state, targetState);
      updateSite({ state: newState });
      setStatus({ type: "success", message: `Status changed to: ${newState}` });
    } catch (e) {
      setStatus({ type: "error", message: (e as Error).message });
    }
  }, [site.state, updateSite]);

  const validateAndBuild = useCallback(() => {
    try {
      // Process markdown if enabled
      const processedSite = useMarkdownMode
        ? {
            ...site,
            pages: site.pages.map((p) => ({
              ...p,
              body: parseMarkdown(p.body),
            })),
          }
        : site;

      validateSiteContent(processedSite);
      const artifacts = renderSiteContent(processedSite);
      setStatus({ type: "success", message: `${t.common.success}! ${artifacts.length} page(s) generated.` });
      return artifacts;
    } catch (e) {
      setStatus({ type: "error", message: (e as Error).message });
      return null;
    }
  }, [site, useMarkdownMode, t]);

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

    zip.file("styles.css", css);

    artifacts.forEach((artifact) => {
      const htmlWithCssLink = artifact.content.replace(
        "</head>",
        `  <link rel="stylesheet" href="styles.css">\n</head>`
      );
      zip.file(artifact.path, htmlWithCssLink);
    });

    if (imageStore.images.length > 0) {
      const imagesFolder = zip.folder("images");
      if (imagesFolder) {
        for (const image of imageStore.images) {
          const base64Data = image.dataUrl.split(",")[1];
          imagesFolder.file(image.name, base64Data, { base64: true });
        }
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${site.seo.title || "website"}.zip`);

    setStatus({ type: "success", message: `ZIP downloaded with ${artifacts.length} page(s) and ${imageStore.images.length} image(s)!` });
  }, [site, validateAndBuild, imageStore.images]);

  const resetSite = useCallback(() => {
    if (confirm(t.common.resetConfirm)) {
      const newSite = createEmptySiteContent(generateId(), site.locale, now());
      setSite(newSite);
      setCurrentPageIndex(0);
      setPreviewHtml(null);
      setPageLayout(defaultLayout);
      imageStore.clearAll();
      setStatus({ type: "info", message: "Project reset" });
    }
  }, [site.locale, imageStore, t]);

  const changeLocale = useCallback((locale: Locale) => {
    updateSite({ locale });
  }, [updateSite]);

  const applyLayoutToPage = useCallback(() => {
    try {
      const rendered = renderPageLayout(pageLayout);
      updatePage({ body: rendered.html });
      setStatus({ type: "success", message: "Layout applied to current page!" });
    } catch (e) {
      setStatus({ type: "error", message: (e as Error).message });
    }
  }, [pageLayout, updatePage]);

  const handleImport = useCallback((data: { site: SiteContent; layout: PageLayout; images: UploadedImage[] }) => {
    setSite(data.site);
    setPageLayout(data.layout);
    imageStore.setImages(data.images);
    setCurrentPageIndex(0);
    setPreviewHtml(null);
  }, [imageStore]);

  return (
    <div className="builder">
      <header className="header">
        <h1>🧊 Quiet Builder</h1>
        <div className="header-controls">
          <select
            value={uiLocale}
            onChange={(e) => setUiLocale(e.target.value as UILocale)}
            className="locale-select"
            title={t.common.uiLanguage}
          >
            <option value="de">🇩🇪 DE</option>
            <option value="en">🇬🇧 EN</option>
          </select>
          <nav className="nav">
            <button
              className={`nav-btn ${screen === "content" ? "active" : ""}`}
              onClick={() => setScreen("content")}
            >
              {t.nav.content}
            </button>
            <button
              className={`nav-btn ${screen === "design" ? "active" : ""}`}
              onClick={() => setScreen("design")}
            >
              {t.nav.design}
            </button>
            <button
              className={`nav-btn ${screen === "publish" ? "active" : ""}`}
              onClick={() => setScreen("publish")}
            >
              {t.nav.publish}
            </button>
          </nav>
        </div>
      </header>

      <ValidationDisplay validation={validation} showWarnings={screen === "content"} t={t} />

      {screen === "content" && (
        <div className="screen">
          <h2>{t.content.title}</h2>

          <div className="form-row">
            <div className="form-group">
              <label>{t.content.language}</label>
              <select
                value={site.locale}
                onChange={(e) => changeLocale(e.target.value as Locale)}
              >
                <option value="en">English</option>
                <option value="pt-BR">Português (Brasil)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useMarkdownMode}
                  onChange={(e) => setUseMarkdownMode(e.target.checked)}
                />
                {t.content.useMarkdown}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>{t.content.pages}</label>
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
              {t.content.addPage}
            </button>
          </div>

          {currentPage && (
            <>
              <div className="form-group">
                <label>
                  {t.content.slug}
                  {currentPage.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(currentPage.slug) && (
                    <span className="field-error"> ⚠️ {t.content.slugError}</span>
                  )}
                </label>
                <input
                  type="text"
                  value={currentPage.slug}
                  onChange={(e) => updatePage({ slug: e.target.value.toLowerCase() })}
                  placeholder="home, about, contact"
                />
                <small>{t.content.slugHint}</small>
              </div>

              <div className="form-group">
                <label>{t.content.pageTitle}</label>
                <input
                  type="text"
                  value={currentPage.title}
                  onChange={(e) => updatePage({ title: e.target.value })}
                  placeholder={t.content.pageTitle}
                />
              </div>

              <div className="form-group">
                <label>{t.content.pageContent} {useMarkdownMode ? "(Markdown)" : "(HTML)"}</label>
                <textarea
                  value={currentPage.body}
                  onChange={(e) => updatePage({ body: e.target.value })}
                  placeholder={useMarkdownMode ? "# Heading\n\nParagraph text..." : "<p>Your content...</p>"}
                />
                <div className="actions" style={{ marginTop: "0.5rem" }}>
                  <button className="btn btn-secondary btn-small" onClick={applyLayoutToPage}>
                    {t.content.applyLayout}
                  </button>
                </div>

                {useMarkdownMode && currentPage.body && (
                  <div className="markdown-preview">
                    <small>{t.common.livePreview}:</small>
                    <div
                      className="preview-box"
                      dangerouslySetInnerHTML={{ __html: processedBody }}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <label>
              {t.content.seoTitle}
              <span className="char-count">{site.seo.title.length}/60</span>
            </label>
            <input
              type="text"
              value={site.seo.title}
              onChange={(e) => updateSite({ seo: { ...site.seo, title: e.target.value } })}
              placeholder={t.content.seoTitleHint}
              className={site.seo.title.length > 60 ? "input-warning" : ""}
            />
          </div>

          <div className="form-group">
            <label>
              {t.content.seoDescription}
              <span className="char-count">{site.seo.description.length}/160</span>
            </label>
            <textarea
              value={site.seo.description}
              onChange={(e) => updateSite({ seo: { ...site.seo, description: e.target.value } })}
              placeholder={t.content.seoDescriptionHint}
              style={{ minHeight: "80px" }}
              className={site.seo.description.length > 160 ? "input-warning" : ""}
            />
          </div>

          <div className="form-group">
            <label>{t.content.images}</label>
            <ImageUploader
              images={imageStore.images}
              onAdd={imageStore.addImage}
              onRemove={imageStore.removeImage}
              error={imageStore.error}
              onClearError={imageStore.clearError}
              t={t}
            />
          </div>

          {status && <div className={`status ${status.type}`}>{status.message}</div>}
        </div>
      )}

      {screen === "design" && (
        <div className="screen">
          <h2>{t.design.title}</h2>
          <p className="info-text">{t.design.info}</p>

          <SectionEditor layout={pageLayout} onChange={setPageLayout} t={t} />

          <div className="download-section" style={{ marginTop: "1.5rem" }}>
            <h3>{t.design.colorPalette} (🧊 {t.design.frozen})</h3>
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
          <h2>{t.publish.title}</h2>

          <div className="form-group">
            <label>{t.publish.currentStatus}</label>
            <div>
              <span className={`state-badge ${site.state}`}>{site.state}</span>
              {!validation.isValid && (
                <span className="state-warning"> ⚠️ {t.publish.validationErrors}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>{t.publish.changeStatus}</label>
            <div className="actions">
              {site.state === "draft" && (
                <button
                  className="btn"
                  onClick={() => handleTransition("review")}
                  disabled={!validation.isValid}
                >
                  {t.publish.toReview}
                </button>
              )}
              {site.state === "review" && (
                <>
                  <button className="btn btn-secondary" onClick={() => handleTransition("draft")}>
                    {t.publish.backToDraft}
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleTransition("published")}
                    disabled={!validation.isValid}
                  >
                    {t.publish.publishNow}
                  </button>
                </>
              )}
              {site.state === "published" && (
                <button className="btn btn-secondary" onClick={() => handleTransition("archived")}>
                  {t.publish.archive}
                </button>
              )}
              {site.state === "archived" && (
                <p className="info-text">{t.publish.archivedInfo}</p>
              )}
            </div>
          </div>

          <div className="download-section">
            <h3 style={{ marginBottom: "1rem" }}>{t.publish.previewDownload}</h3>
            <div className="actions">
              <button className="btn btn-secondary" onClick={generatePreview}>
                {t.publish.generatePreview}
              </button>
              <button className="btn" onClick={downloadAsZip} disabled={!validation.isValid}>
                {t.publish.downloadZip}
              </button>
            </div>

            {previewHtml && (
              <div style={{ marginTop: "1rem" }}>
                <ResponsivePreview html={previewHtml} t={t} />
              </div>
            )}
          </div>

          <div className="download-section">
            <h3 style={{ marginBottom: "1rem" }}>{t.publish.project}</h3>
            <JsonImportExport
              site={site}
              layout={pageLayout}
              images={imageStore.images}
              onImport={handleImport}
              onStatus={setStatus}
              t={t}
            />
            <div className="actions" style={{ marginTop: "0.5rem" }}>
              <button className="btn btn-secondary" onClick={resetSite}>
                {t.publish.resetProject}
              </button>
            </div>
            <p className="info-text" style={{ marginTop: "0.5rem" }}>
              {t.publish.autoSaveInfo}
              {imageStore.images.length > 0 && ` (${imageStore.images.length} ${t.content.images.toLowerCase()})`}
            </p>
          </div>

          {status && <div className={`status ${status.type}`}>{status.message}</div>}
        </div>
      )}
    </div>
  );
}
