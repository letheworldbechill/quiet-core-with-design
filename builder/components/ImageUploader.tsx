import { useRef, type DragEvent, useState } from "react";
import type { UploadedImage } from "../hooks";
import type { Translations } from "../i18n";

type ImageUploaderProps = {
  images: UploadedImage[];
  onAdd: (file: File) => Promise<UploadedImage | null>;
  onRemove: (id: string) => void;
  error: string | null;
  onClearError: () => void;
  t: Translations;
};

export function ImageUploader({ images, onAdd, onRemove, error, onClearError, t }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      await onAdd(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const copyToClipboard = (image: UploadedImage) => {
    const imgTag = `<img src="${image.dataUrl}" alt="${image.name}" />`;
    navigator.clipboard.writeText(imgTag);
  };

  return (
    <div className="image-uploader">
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: "none" }}
        />
        <div className="drop-zone-content">
          <span className="drop-icon">📷</span>
          <p>{t.images.dropzone}</p>
          <small>{t.images.dropzoneHint}</small>
        </div>
      </div>

      {error && (
        <div className="status error" onClick={onClearError}>
          {error} ({t.common.clickToClose})
        </div>
      )}

      {images.length > 0 && (
        <div className="image-grid">
          {images.map((image) => (
            <div key={image.id} className="image-item">
              <div className="image-preview">
                <img src={image.dataUrl} alt={image.name} />
              </div>
              <div className="image-info">
                <span className="image-name" title={image.name}>
                  {image.name.length > 20 ? `${image.name.slice(0, 17)}...` : image.name}
                </span>
                <span className="image-size">{formatSize(image.size)}</span>
              </div>
              <div className="image-actions">
                <button
                  onClick={() => copyToClipboard(image)}
                  title="HTML-Tag kopieren"
                  className="btn-small"
                >
                  📋
                </button>
                <button
                  onClick={() => onRemove(image.id)}
                  title="Löschen"
                  className="btn-small btn-danger"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="info-text" style={{ marginTop: "0.5rem" }}>
          {t.images.copyHint}
        </p>
      )}
    </div>
  );
}
