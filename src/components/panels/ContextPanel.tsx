import { Variable } from "lucide-react";
import { Panel } from "@/components/layout/Panel";
import { Separator } from "@/components/ui/separator";

interface ContextPanelProps {
  /** Extra classes for sizing within the layout. */
  className?: string;
}

interface SectionProps {
  title: string;
  hint: string;
}

function Section({ title, hint }: SectionProps) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
        {hint}
      </div>
    </div>
  );
}

/**
 * Placeholder for the context panel: the defined variables/functions of the
 * current session and the calculation history. Both are empty until the engine
 * is wired in.
 */
export function ContextPanel({ className }: ContextPanelProps) {
  return (
    <Panel title="Kontext" icon={Variable} className={className}>
      <div className="space-y-4">
        <Section title="Variablen & Funktionen" hint="Noch nichts definiert." />
        <Separator />
        <Section title="Verlauf" hint="Noch keine Berechnungen." />
      </div>
    </Panel>
  );
}
