import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { WorkArea } from "@/components/workspace/WorkArea";
import { GraphPanel } from "@/components/plotter/GraphPanel";
import { ContextPanel } from "@/components/panels/ContextPanel";
import type { Mode } from "@/components/layout/mode";

/**
 * Application shell (layout phase). Composes the navbar and the three regions:
 * the work area, the graph panel and the context panel. No engine wiring yet.
 */
function App() {
  const [mode, setMode] = useState<Mode>("calculator");

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Navbar mode={mode} onModeChange={setMode} />

      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row">
        <WorkArea mode={mode} className="min-h-0 flex-1" />

        <aside className="flex min-h-0 flex-col gap-3 lg:w-[360px]">
          <GraphPanel className="min-h-60 flex-1" />
          <ContextPanel className="min-h-60 flex-1" />
        </aside>
      </main>
    </div>
  );
}

export default App;
