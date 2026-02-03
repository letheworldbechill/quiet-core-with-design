/**
 * Share placeholder.
 * Shows where QR, links, and social preview will appear.
 * No functionality, no generation, no state.
 */

export function SharePlaceholder() {
  return (
    <section style={{ opacity: 0.6 }}>
      <h3>Teilen</h3>
      <ul>
        <li>QR-Code (noch nicht generiert)</li>
        <li>Link teilen</li>
        <li>Social Preview</li>
      </ul>

      <p style={{ fontSize: "13px" }}>
        Diese Elemente entstehen nach der Veröffentlichung.
      </p>
    </section>
  );
}
