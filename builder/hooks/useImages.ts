import { useState, useCallback } from "react";

export type UploadedImage = {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  type: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function useImages(initialImages: UploadedImage[] = []) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [error, setError] = useState<string | null>(null);

  const addImage = useCallback((file: File): Promise<UploadedImage | null> => {
    return new Promise((resolve) => {
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Ungültiger Dateityp: ${file.type}. Erlaubt: JPEG, PNG, GIF, WebP`);
        resolve(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`Datei zu groß: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 5MB`);
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newImage: UploadedImage = {
          id: crypto.randomUUID(),
          name: file.name,
          dataUrl,
          size: file.size,
          type: file.type,
        };
        setImages((prev) => [...prev, newImage]);
        resolve(newImage);
      };
      reader.onerror = () => {
        setError("Fehler beim Lesen der Datei");
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearAll = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);

  return {
    images,
    error,
    addImage,
    removeImage,
    clearError,
    clearAll,
    setImages,
  };
}
