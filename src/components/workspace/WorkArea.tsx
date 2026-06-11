import { Calculator, NotebookPen } from "lucide-react";
import { Panel } from "@/components/layout/Panel";

/** The work-area surfaces that exist (graph mode has its own layout instead). */
type WorkAreaVariant = "calculator" | "notebook";

interface WorkAreaProps {
  /** Which surface to render. */
  variant: WorkAreaVariant;
  /** Extra classes for sizing within the layout. */
  className?: string;
}

const VARIANTS = {
  calculator: {
    title: "Rechner",
    icon: Calculator,
    hint: "Hier entsteht das Eingabefeld für schnelle Berechnungen.",
  },
  notebook: {
    title: "Notebook",
    icon: NotebookPen,
    hint: "Hier entsteht die Arbeitsfläche aus Zellen, die sich Definitionen merkt.",
  },
} as const;

/**
 * The main work area. In this layout phase it only shows a variant-dependent
 * placeholder — the actual input surfaces come in later phases.
 */
export function WorkArea({ variant, className }: WorkAreaProps) {
  const { title, icon: Icon, hint } = VARIANTS[variant];

  return (
    <Panel title={title} icon={Icon} className={className}>
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <span className="grid size-14 place-items-center rounded-2xl border border-dashed bg-muted/30 text-muted-foreground">
          <Icon className="size-7" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="max-w-xs text-sm text-muted-foreground">{hint}</p>
        </div>
      </div>
    </Panel>
  );
}
