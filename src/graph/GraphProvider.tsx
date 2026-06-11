import { useMemo, useState, type ReactNode } from "react";
import {
  GraphContext,
  DEFAULT_VIEWPORT,
  type GraphState,
  type PlottedFunction,
  type Viewport,
} from "./graph";

/**
 * Provides the shared graph state to the whole app. Because the Graph mode and
 * the notebook's graph both read from this single store, they stay in sync
 * automatically — same functions, same window. This is pure UI state; the math
 * engine is not involved. Empty for now; plotting fills it in a later phase.
 */
export function GraphProvider({ children }: { children: ReactNode }) {
  const [functions, setFunctions] = useState<PlottedFunction[]>([]);
  const [viewport, setViewport] = useState<Viewport>(DEFAULT_VIEWPORT);

  const value = useMemo<GraphState>(
    () => ({ functions, viewport, setFunctions, setViewport }),
    [functions, viewport]
  );

  return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>;
}
