/**
 * Projeto store.
 *
 * This store holds ONLY UI state.
 * It does NOT hold truth about content validity or publishability.
 *
 * Truth comes from core.
 * This store is temporary and forgettable.
 */

export type Screen = "content" | "design" | "publish";

export type ProjetoState = {
  currentScreen: Screen;
  // Temporary input values (not validated)
  draft: {
    title: string;
    description: string;
  };
};

export const initialState: ProjetoState = {
  currentScreen: "content",
  draft: {
    title: "",
    description: "",
  },
};

/**
 * State is managed by the UI framework.
 * This file only defines the shape.
 */
