/**
 * Media placeholder.
 * Shows where images will appear later.
 * No functionality, no upload, no state.
 */

export function MediaPlaceholder() {
  return (
    <section style={{ opacity: 0.6 }}>
      <h3>Fotos</h3>
      <p>Noch keine Bilder hinzugefügt.</p>

      <div
        style={{
          border: "1px dashed #ccc",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        Hier werden später Fotos angezeigt.
      </div>
    </section>
  );
}
