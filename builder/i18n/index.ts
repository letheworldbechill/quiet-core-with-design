export type UILocale = "de" | "en";

export type Translations = {
  // Navigation
  nav: {
    content: string;
    design: string;
    publish: string;
  };
  // Content screen
  content: {
    title: string;
    language: string;
    pages: string;
    addPage: string;
    slug: string;
    slugHint: string;
    slugError: string;
    pageTitle: string;
    pageContent: string;
    pageContentHint: string;
    applyLayout: string;
    seoTitle: string;
    seoTitleHint: string;
    seoDescription: string;
    seoDescriptionHint: string;
    images: string;
    useMarkdown: string;
  };
  // Design screen
  design: {
    title: string;
    info: string;
    addSection: string;
    colorPalette: string;
    frozen: string;
    sectionType: string;
    grid: string;
    gridCentered: string;
    gridTwoCol: string;
    gridTwoColMirror: string;
    contents: string;
    addSlot: string;
  };
  // Publish screen
  publish: {
    title: string;
    currentStatus: string;
    changeStatus: string;
    toReview: string;
    backToDraft: string;
    publishNow: string;
    archive: string;
    archivedInfo: string;
    previewDownload: string;
    generatePreview: string;
    downloadZip: string;
    project: string;
    resetProject: string;
    autoSaveInfo: string;
    validationErrors: string;
    responsive: string;
    desktop: string;
    tablet: string;
    mobile: string;
  };
  // Common
  common: {
    delete: string;
    cancel: string;
    confirm: string;
    export: string;
    import: string;
    download: string;
    upload: string;
    error: string;
    success: string;
    warning: string;
    minOnePage: string;
    resetConfirm: string;
    importSuccess: string;
    exportSuccess: string;
    invalidFile: string;
    livePreview: string;
    rawData: string;
    settings: string;
    uiLanguage: string;
    clickToClose: string;
    moveUp: string;
    moveDown: string;
    enterContent: string;
    listPlaceholder: string;
    sectionsRequired: string;
  };
  // Image uploader
  images: {
    dropzone: string;
    dropzoneHint: string;
    copyTag: string;
    copyHint: string;
  };
  // Validation
  validation: {
    errors: string;
    hints: string;
    slugEmpty: string;
    slugInvalid: string;
    titleEmpty: string;
    seoTitleEmpty: string;
    seoTitleShort: string;
    seoTitleLong: string;
    seoDescEmpty: string;
    seoDescShort: string;
    seoDescLong: string;
    duplicateSlugs: string;
  };
  // Declaration types
  declarations: {
    a: { name: string; desc: string };
    b: { name: string; desc: string };
    c: { name: string; desc: string };
    d: { name: string; desc: string };
    e: { name: string; desc: string };
  };
  // Slot types
  slots: {
    primary: string;
    secondary: string;
    meta: string;
    list: string;
    quote: string;
  };
};

export const translations: Record<UILocale, Translations> = {
  de: {
    nav: {
      content: "Inhalt",
      design: "Design",
      publish: "Veröffentlichen",
    },
    content: {
      title: "Inhalt bearbeiten",
      language: "Sprache",
      pages: "Seiten",
      addPage: "+ Seite hinzufügen",
      slug: "Slug",
      slugHint: "Nur Kleinbuchstaben, Zahlen und Bindestriche",
      slugError: "Ungültiges Format",
      pageTitle: "Titel",
      pageContent: "Inhalt",
      pageContentHint: "HTML oder Markdown eingeben",
      applyLayout: "Design-Layout anwenden",
      seoTitle: "SEO Titel",
      seoTitleHint: "Website-Titel für Suchmaschinen",
      seoDescription: "SEO Beschreibung",
      seoDescriptionHint: "Kurze Beschreibung für Suchmaschinen",
      images: "Bilder",
      useMarkdown: "Markdown verwenden",
    },
    design: {
      title: "Design System",
      info: "Erstelle Sections mit dem eingefrorenen Design System.",
      addSection: "+ Section hinzufügen",
      colorPalette: "Farbpalette",
      frozen: "eingefroren",
      sectionType: "Typ",
      grid: "Grid",
      gridCentered: "Zentriert",
      gridTwoCol: "Zwei-Spaltig",
      gridTwoColMirror: "Zwei-Spaltig (gespiegelt)",
      contents: "Inhalte",
      addSlot: "Slot hinzufügen:",
    },
    publish: {
      title: "Veröffentlichen",
      currentStatus: "Aktueller Status",
      changeStatus: "Status ändern",
      toReview: "Zur Prüfung",
      backToDraft: "Zurück zu Entwurf",
      publishNow: "Veröffentlichen",
      archive: "Archivieren",
      archivedInfo: "Archivierte Inhalte können nicht mehr geändert werden.",
      previewDownload: "Vorschau & Download",
      generatePreview: "Vorschau generieren",
      downloadZip: "📦 Als ZIP herunterladen",
      project: "Projekt",
      resetProject: "Projekt zurücksetzen",
      autoSaveInfo: "Daten werden automatisch im Browser gespeichert.",
      validationErrors: "Validierungsfehler vorhanden",
      responsive: "Responsive Vorschau",
      desktop: "Desktop",
      tablet: "Tablet",
      mobile: "Mobil",
    },
    common: {
      delete: "Löschen",
      cancel: "Abbrechen",
      confirm: "Bestätigen",
      export: "Exportieren",
      import: "Importieren",
      download: "Herunterladen",
      upload: "Hochladen",
      error: "Fehler",
      success: "Erfolg",
      warning: "Warnung",
      minOnePage: "Mindestens eine Seite erforderlich",
      resetConfirm: "Alle Daten löschen und neu beginnen?",
      importSuccess: "Import erfolgreich!",
      exportSuccess: "Export erfolgreich!",
      invalidFile: "Ungültige Datei",
      livePreview: "Live-Vorschau",
      rawData: "Rohdaten (JSON)",
      settings: "Einstellungen",
      uiLanguage: "Oberflächensprache",
      clickToClose: "klicken zum schließen",
      moveUp: "Nach oben",
      moveDown: "Nach unten",
      enterContent: "Inhalt eingeben...",
      listPlaceholder: "Element 1, Element 2, Element 3",
      sectionsRequired: "Sections nötig",
    },
    images: {
      dropzone: "Bilder hier ablegen oder klicken",
      dropzoneHint: "JPEG, PNG, GIF, WebP • Max 5MB",
      copyTag: "HTML-Tag kopieren",
      copyHint: "Klicke 📋 um den HTML-Tag zu kopieren und füge ihn im Seiteninhalt ein.",
    },
    validation: {
      errors: "Fehler",
      hints: "Hinweise",
      slugEmpty: "Slug darf nicht leer sein",
      slugInvalid: "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten",
      titleEmpty: "Titel darf nicht leer sein",
      seoTitleEmpty: "SEO-Titel darf nicht leer sein",
      seoTitleShort: "SEO-Titel ist kurz",
      seoTitleLong: "SEO-Titel ist zu lang",
      seoDescEmpty: "SEO-Beschreibung darf nicht leer sein",
      seoDescShort: "SEO-Beschreibung ist kurz",
      seoDescLong: "SEO-Beschreibung ist zu lang",
      duplicateSlugs: "Doppelte Slugs gefunden",
    },
    declarations: {
      a: { name: "Focus Opening", desc: "Zentrierter Einstieg" },
      b: { name: "Explanation", desc: "Erklärung/Kontext" },
      c: { name: "Enumeration", desc: "Aufzählung/Struktur" },
      d: { name: "Emphasis", desc: "Betonung (nur bei ≥5 Sections)" },
      e: { name: "Closure", desc: "Abschluss" },
    },
    slots: {
      primary: "Haupttext (groß)",
      secondary: "Nebentext",
      meta: "Meta-Info (klein)",
      list: "Liste (kommagetrennt)",
      quote: "Zitat",
    },
  },
  en: {
    nav: {
      content: "Content",
      design: "Design",
      publish: "Publish",
    },
    content: {
      title: "Edit Content",
      language: "Language",
      pages: "Pages",
      addPage: "+ Add Page",
      slug: "Slug",
      slugHint: "Only lowercase letters, numbers, and hyphens",
      slugError: "Invalid format",
      pageTitle: "Title",
      pageContent: "Content",
      pageContentHint: "Enter HTML or Markdown",
      applyLayout: "Apply Design Layout",
      seoTitle: "SEO Title",
      seoTitleHint: "Website title for search engines",
      seoDescription: "SEO Description",
      seoDescriptionHint: "Short description for search engines",
      images: "Images",
      useMarkdown: "Use Markdown",
    },
    design: {
      title: "Design System",
      info: "Create sections using the frozen design system.",
      addSection: "+ Add Section",
      colorPalette: "Color Palette",
      frozen: "frozen",
      sectionType: "Type",
      grid: "Grid",
      gridCentered: "Centered",
      gridTwoCol: "Two-Column",
      gridTwoColMirror: "Two-Column (mirrored)",
      contents: "Contents",
      addSlot: "Add slot:",
    },
    publish: {
      title: "Publish",
      currentStatus: "Current Status",
      changeStatus: "Change Status",
      toReview: "Submit for Review",
      backToDraft: "Back to Draft",
      publishNow: "Publish",
      archive: "Archive",
      archivedInfo: "Archived content cannot be modified.",
      previewDownload: "Preview & Download",
      generatePreview: "Generate Preview",
      downloadZip: "📦 Download as ZIP",
      project: "Project",
      resetProject: "Reset Project",
      autoSaveInfo: "Data is automatically saved in browser.",
      validationErrors: "Validation errors present",
      responsive: "Responsive Preview",
      desktop: "Desktop",
      tablet: "Tablet",
      mobile: "Mobile",
    },
    common: {
      delete: "Delete",
      cancel: "Cancel",
      confirm: "Confirm",
      export: "Export",
      import: "Import",
      download: "Download",
      upload: "Upload",
      error: "Error",
      success: "Success",
      warning: "Warning",
      minOnePage: "At least one page required",
      resetConfirm: "Delete all data and start over?",
      importSuccess: "Import successful!",
      exportSuccess: "Export successful!",
      invalidFile: "Invalid file",
      livePreview: "Live Preview",
      rawData: "Raw Data (JSON)",
      settings: "Settings",
      uiLanguage: "Interface Language",
      clickToClose: "click to close",
      moveUp: "Move up",
      moveDown: "Move down",
      enterContent: "Enter content...",
      listPlaceholder: "Item 1, Item 2, Item 3",
      sectionsRequired: "sections required",
    },
    images: {
      dropzone: "Drop images here or click",
      dropzoneHint: "JPEG, PNG, GIF, WebP • Max 5MB",
      copyTag: "Copy HTML tag",
      copyHint: "Click 📋 to copy the HTML tag and paste it in page content.",
    },
    validation: {
      errors: "Errors",
      hints: "Hints",
      slugEmpty: "Slug cannot be empty",
      slugInvalid: "Slug can only contain lowercase letters, numbers, and hyphens",
      titleEmpty: "Title cannot be empty",
      seoTitleEmpty: "SEO title cannot be empty",
      seoTitleShort: "SEO title is short",
      seoTitleLong: "SEO title is too long",
      seoDescEmpty: "SEO description cannot be empty",
      seoDescShort: "SEO description is short",
      seoDescLong: "SEO description is too long",
      duplicateSlugs: "Duplicate slugs found",
    },
    declarations: {
      a: { name: "Focus Opening", desc: "Centered entry" },
      b: { name: "Explanation", desc: "Explanation/Context" },
      c: { name: "Enumeration", desc: "Enumeration/Structure" },
      d: { name: "Emphasis", desc: "Emphasis (only with ≥5 sections)" },
      e: { name: "Closure", desc: "Closure" },
    },
    slots: {
      primary: "Primary text (large)",
      secondary: "Secondary text",
      meta: "Meta info (small)",
      list: "List (comma-separated)",
      quote: "Quote",
    },
  },
};

export function useTranslations(locale: UILocale): Translations {
  return translations[locale];
}
