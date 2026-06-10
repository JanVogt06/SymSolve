import { Panel } from "@/components/layout/Panel";
import { MODES, type Mode } from "@/components/layout/mode";

interface WorkAreaProps {
  /** Active mode — decides the title and placeholder shown. */
  mode: Mode;
  /** Extra classes for sizing within the layout. */
  className?: string;
}

const PLACEHOLDER: Record<Mode, { title: string; hint: string }> = {
  calculator: {
    title: "Rechner",
    hint: "Hier entsteht das Eingabefeld für schnelle Berechnungen.",
  },
  notebook: {
    title: "Notebook",
    hint: "Hier entsteht die Arbeitsfläche aus Zellen, die sich Definitionen merkt.",
  },
};

/**
 * The main work area. In this layout phase it only shows a mode-dependent
 * placeholder — the actual input surfaces come in later phases.
 */
export function WorkArea({ mode, className }: WorkAreaProps) {
  const descriptor = MODES.find((entry) => entry.id === mode) ?? MODES[0];
  const Icon = descriptor.icon;
  const { title, hint } = PLACEHOLDER[mode];

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
