import { createContext, useContext } from "react";

/**
 * A single function/expression drawn on the graph.
 *
 * For now `expression` is the raw input text; a later phase will carry the
 * parsed Expression (AST) from the engine instead.
 */
export interface PlottedFunction {
  /** Stable id for list rendering and updates. */
  id: string;
  /** The expression to plot, as entered. */
  expression: string;
  /** Stroke colour used when drawing the curve. */
  color: string;
  /** Whether the function is currently shown. */
  visible: boolean;
}

/** The visible window of the coordinate system. */
export interface Viewport {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/** The window shown before the user zooms or pans. */
export const DEFAULT_VIEWPORT: Viewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

/**
 * The single source of truth for the graph. Both the Graph mode and the
 * notebook's graph read from this, so they always show the same thing.
 */
export interface GraphState {
  /** The functions currently on the graph. */
  functions: PlottedFunction[];
  /** The visible coordinate window. */
  viewport: Viewport;
  /** Replaces the list of plotted functions. */
  setFunctions: (functions: PlottedFunction[]) => void;
  /** Replaces the visible window. */
  setViewport: (viewport: Viewport) => void;
}

/** Shared graph context. `null` until a GraphProvider is mounted above. */
export const GraphContext = createContext<GraphState | null>(null);

/**
 * Accesses the shared graph state.
 *
 * @returns The current graph state.
 * @throws If called outside of a GraphProvider.
 */
export function useGraph(): GraphState {
  const value = useContext(GraphContext);
  if (value === null) {
    throw new Error("useGraph must be used within a GraphProvider.");
  }
  return value;
}
