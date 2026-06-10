import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MODES, type Mode } from "./mode";

interface ModeSwitchProps {
  /** Currently active mode. */
  value: Mode;
  /** Called when the user picks a different mode. */
  onChange: (mode: Mode) => void;
}

/**
 * Segmented control in the navbar that switches between calculator and notebook
 * mode. Visual only for now — both modes show placeholder content.
 */
export function ModeSwitch({ value, onChange }: ModeSwitchProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        // Radix emits "" when the active item is toggled off; ignore that so a
        // mode is always selected.
        if (next) onChange(next as Mode);
      }}
      variant="outline"
      size="sm"
      aria-label="Modus wählen"
    >
      {MODES.map(({ id, label, icon: Icon }) => (
        <ToggleGroupItem key={id} value={id} aria-label={label} className="gap-1.5 px-3">
          <Icon className="size-4" />
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
