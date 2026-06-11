import type { ComponentType } from "react";
import { Calculator, ChartSpline, NotebookPen } from "lucide-react";

/** The three ways to work with the engine. See ARCHITECTURE.md → UI. */
export type Mode = "calculator" | "graph" | "notebook";

/** UI metadata describing a single mode (label and icon for the switch). */
export interface ModeDescriptor {
  id: Mode;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

/** The available modes, in display order. */
export const MODES: ModeDescriptor[] = [
  { id: "calculator", label: "Rechner", icon: Calculator },
  { id: "graph", label: "Graph", icon: ChartSpline },
  { id: "notebook", label: "Notebook", icon: NotebookPen },
];
