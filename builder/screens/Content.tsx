/**
 * Content screen.
 * Text input for pages.
 */

import { MediaPlaceholder } from "../components";

export function Content() {
  return (
    <main>
      <h2>Inhalt</h2>

      <section>
        <h3>Seiten</h3>
        <p style={{ opacity: 0.6 }}>Seiteninhalt wird hier bearbeitet.</p>
      </section>

      <MediaPlaceholder />
    </main>
  );
}
