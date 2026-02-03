/**
 * Builder App.
 *
 * Minimal shell showing screen structure.
 * No routing, no state management framework.
 */

import { Content, Design, Publish } from "./screens";
import type { Screen } from "./projetoStore";

type AppProps = {
  screen: Screen;
};

export function App({ screen }: AppProps) {
  return (
    <div>
      <nav style={{ opacity: 0.6, marginBottom: "24px" }}>
        <span>[Inhalt]</span>
        <span> | </span>
        <span>[Design]</span>
        <span> | </span>
        <span>[Veröffentlichen]</span>
      </nav>

      {screen === "content" && <Content />}
      {screen === "design" && <Design />}
      {screen === "publish" && <Publish />}
    </div>
  );
}
