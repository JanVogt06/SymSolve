import { ChartSpline } from "lucide-react";
import { Panel } from "@/components/layout/Panel";

interface GraphPanelProps {
  /** Extra classes for sizing within the layout. */
  className?: string;
}

/**
 * Placeholder for the graph/plot area. Shows an empty, grid-lined canvas; the
 * actual plotting is wired up in a later phase.
 */
export function GraphPanel({ className }: GraphPanelProps) {
  return (
    <Panel title="Graph" icon={ChartSpline} className={className}>
      <div className="relative h-full min-h-40 overflow-hidden rounded-lg border bg-background">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <p className="text-sm text-muted-foreground">Graph-Ansicht folgt</p>
        </div>
      </div>
    </Panel>
  );
}
