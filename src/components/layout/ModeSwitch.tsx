import { Fragment } from "react";
import { Link2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MODES, type Mode, type ModeDescriptor } from "./mode";

interface ModeSwitchProps {
  /** Currently active mode. */
  value: Mode;
  /** Called when the user picks a different mode. */
  onChange: (mode: Mode) => void;
}

/** Calculator stands on its own; graph and notebook share state, so they group. */
const STANDALONE_MODES = MODES.filter((mode) => mode.id === "calculator");
const LINKED_MODES = MODES.filter((mode) => mode.id === "graph" || mode.id === "notebook");

function ModeItem({ mode }: { mode: ModeDescriptor }) {
  const Icon = mode.icon;
  return (
    <ToggleGroupItem value={mode.id} aria-label={mode.label} className="gap-1.5 px-3">
      <Icon className="size-4" />
      {mode.label}
    </ToggleGroupItem>
  );
}

/**
 * Mode switch in the navbar. Calculator is independent; graph and notebook share
 * the same graph and definitions, so they are visually grouped inside a dashed
 * outline with a link icon between them to signal that connection.
 */
export function ModeSwitch({ value, onChange }: ModeSwitchProps) {
  // Radix emits "" when the active item is toggled off; ignore that so a mode is
  // always selected.
  const handleChange = (next: string) => {
    if (next) onChange(next as Mode);
  };

  return (
    <div className="flex h-9 items-center gap-2">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={handleChange}
        variant="outline"
        size="sm"
        aria-label="Eigenständiger Modus"
      >
        {STANDALONE_MODES.map((mode) => (
          <ModeItem key={mode.id} mode={mode} />
        ))}
      </ToggleGroup>

      <div
        className="flex h-full items-center rounded-lg border border-dashed border-border px-1.5"
        title="Graph und Notebook teilen sich denselben Graphen und dieselben Definitionen"
      >
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={handleChange}
          variant="outline"
          size="sm"
          aria-label="Verknüpfte Modi (Graph und Notebook)"
        >
          {LINKED_MODES.map((mode, index) => (
            <Fragment key={mode.id}>
              {index > 0 && (
                <Link2 className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <ModeItem mode={mode} />
            </Fragment>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
