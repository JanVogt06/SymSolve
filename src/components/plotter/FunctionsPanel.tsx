import { FunctionSquare, Plus } from "lucide-react";
import { Panel } from "@/components/layout/Panel";
import { Button } from "@/components/ui/button";
import { useGraph } from "@/graph/graph";

interface FunctionsPanelProps {
  /** Extra classes for sizing within the layout. */
  className?: string;
}

/**
 * The graph mode's function list — where the user manages the expressions to
 * plot. Reads the shared graph state, so it reflects the same functions the
 * graph draws. Empty until plotting is wired in.
 */
export function FunctionsPanel({ className }: FunctionsPanelProps) {
  const { functions } = useGraph();

  return (
    <Panel
      title="Funktionen"
      icon={FunctionSquare}
      className={className}
      actions={
        <Button variant="ghost" size="icon-sm" aria-label="Funktion hinzufügen">
          <Plus />
        </Button>
      }
    >
      {functions.length === 0 ? (
        <div className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
          Noch keine Funktionen zum Plotten.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {functions.map((fn) => (
            <li key={fn.id} className="flex items-center gap-2 text-sm">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: fn.color }} />
              <span className="font-mono">{fn.expression}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
