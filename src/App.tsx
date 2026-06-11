import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { WorkArea } from "@/components/workspace/WorkArea";
import { GraphPanel } from "@/components/plotter/GraphPanel";
import { FunctionsPanel } from "@/components/plotter/FunctionsPanel";
import { ContextPanel } from "@/components/panels/ContextPanel";
import { HistoryPanel } from "@/components/panels/HistoryPanel";
import { GraphProvider } from "@/graph/GraphProvider";
import type { Mode } from "@/components/layout/mode";

/** Renders the mode-specific layout inside the main area. */
function ModeLayout({ mode }: { mode: Mode }) {
  switch (mode) {
    case "calculator":
      // Calculator surface plus its own history — no graph, no declarations.
      return (
        <>
          <WorkArea variant="calculator" className="min-h-0 flex-1" />
          <aside className="flex min-h-0 flex-col gap-3 lg:w-80">
            <HistoryPanel className="min-h-0 flex-1" />
          </aside>
        </>
      );

    case "graph":
      // Focused plotting: large plot plus a list of functions to draw.
      return (
        <>
          <GraphPanel className="min-h-0 flex-1" />
          <aside className="flex min-h-0 flex-col gap-3 lg:w-80">
            <FunctionsPanel className="min-h-0 flex-1" />
          </aside>
        </>
      );

    case "notebook":
      // Full workspace: cells, with a graph and the context (definitions) beside.
      return (
        <>
          <WorkArea variant="notebook" className="min-h-0 flex-1" />
          <aside className="flex min-h-0 flex-col gap-3 lg:w-80">
            <GraphPanel className="min-h-60 flex-1" />
            <ContextPanel className="min-h-60 flex-1" />
          </aside>
        </>
      );
  }
}

/**
 * Application shell (layout phase). Composes the navbar and the mode-specific
 * layout. No engine wiring yet.
 */
function App() {
  const [mode, setMode] = useState<Mode>("calculator");

  return (
    <GraphProvider>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <Navbar mode={mode} onModeChange={setMode} />

        <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row">
          <ModeLayout mode={mode} />
        </main>
      </div>
    </GraphProvider>
  );
}

export default App;
