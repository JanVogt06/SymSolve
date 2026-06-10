import type { ComponentType } from "react";
import { Calculator, NotebookPen } from "lucide-react";

/** The two ways to work with the engine. See ARCHITECTURE.md → UI. */
export type Mode = "calculator" | "notebook";

/** UI metadata describing a single mode (label and icon for the switch). */
export interface ModeDescriptor {
  id: Mode;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

/** The available modes, in display order. */
export const MODES: ModeDescriptor[] = [
  { id: "calculator", label: "Rechner", icon: Calculator },
  { id: "notebook", label: "Notebook", icon: NotebookPen },
];
