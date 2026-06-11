import { ChartSpline } from "lucide-react";
import { Panel } from "@/components/layout/Panel";
import { useGraph } from "@/graph/graph";

interface GraphPanelProps {
  /** Extra classes for sizing within the layout. */
  className?: string;
}

/**
 * The graph/plot area. Reads the shared graph state, so the instance in the
 * Graph mode and the one in the notebook always show the same functions. The
 * actual drawing is wired up in a later phase; for now it renders an empty,
 * grid-lined canvas.
 */
export function GraphPanel({ className }: GraphPanelProps) {
  const { functions } = useGraph();

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
          <p className="text-sm text-muted-foreground">
            {functions.length === 0 ? "Graph-Ansicht folgt" : `${functions.length} Funktion(en)`}
          </p>
        </div>
      </div>
    </Panel>
  );
}
