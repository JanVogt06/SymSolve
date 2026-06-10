import { Moon, Settings, Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeSwitch } from "./ModeSwitch";
import type { Mode } from "./mode";

interface NavbarProps {
  /** Currently active mode. */
  mode: Mode;
  /** Called when the user switches mode. */
  onModeChange: (mode: Mode) => void;
}

/**
 * Top application bar: brand on the left, the mode switch centred, and global
 * actions on the right. The action buttons are placeholders for now.
 */
export function Navbar({ mode, onModeChange }: NavbarProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b bg-card px-4">
      <div className="flex items-center gap-2 font-semibold">
        <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Sigma className="size-4" />
        </span>
        SymSolve
      </div>

      <div className="flex flex-1 justify-center">
        <ModeSwitch value={mode} onChange={onModeChange} />
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Darstellung umschalten">
          <Moon />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Einstellungen">
          <Settings />
        </Button>
      </div>
    </header>
  );
}
