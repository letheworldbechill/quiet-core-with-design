import { useRef } from "react";
import type { SiteContent } from "../../core";
import type { PageLayout } from "../../design-system";
import type { UploadedImage } from "../hooks";
import type { Translations } from "../i18n";

type ExportData = {
  version: string;
  exportedAt: string;
  site: SiteContent;
  layout: PageLayout;
  images: UploadedImage[];
};

type JsonImportExportProps = {
  site: SiteContent;
  layout: PageLayout;
  images: UploadedImage[];
  onImport: (data: { site: SiteContent; layout: PageLayout; images: UploadedImage[] }) => void;
  onStatus: (status: { type: "success" | "error"; message: string }) => void;
  t: Translations;
};

export function JsonImportExport({
  site,
  layout,
  images,
  onImport,
  onStatus,
  t,
}: JsonImportExportProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data: ExportData = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      site,
      layout,
      images,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${site.seo.title || "project"}-backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onStatus({ type: "success", message: t.common.exportSuccess });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json) as ExportData;

        // Validate structure
        if (!data.site || !data.layout) {
          throw new Error("Invalid file structure");
        }

        // Validate site has required fields
        if (!data.site.id || !data.site.pages || !data.site.seo) {
          throw new Error("Invalid site data");
        }

        onImport({
          site: data.site,
          layout: data.layout,
          images: data.images || [],
        });

        onStatus({ type: "success", message: t.common.importSuccess });
      } catch {
        onStatus({ type: "error", message: t.common.invalidFile });
      }

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      onStatus({ type: "error", message: t.common.invalidFile });
    };

    reader.readAsText(file);
  };

  return (
    <div className="json-import-export">
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: "none" }}
      />

      <div className="actions">
        <button
          className="btn btn-secondary"
          onClick={() => inputRef.current?.click()}
        >
          📥 {t.common.import} JSON
        </button>
        <button className="btn btn-secondary" onClick={handleExport}>
          📤 {t.common.export} JSON
        </button>
      </div>
    </div>
  );
}
