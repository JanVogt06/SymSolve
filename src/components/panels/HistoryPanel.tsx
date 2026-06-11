import { History } from "lucide-react";
import { Panel } from "@/components/layout/Panel";

interface HistoryPanelProps {
  /** Extra classes for sizing within the layout. */
  className?: string;
}

/**
 * The calculator's history of past computations. This is the calculator's own
 * history — separate from the notebook's — so the two never mix. Empty until the
 * engine is wired in.
 */
export function HistoryPanel({ className }: HistoryPanelProps) {
  return (
    <Panel title="Verlauf" icon={History} className={className}>
      <div className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
        Noch keine Berechnungen.
      </div>
    </Panel>
  );
}
