import type { ComponentType, ReactNode } from "react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PanelProps {
  /** Short title shown in the panel header. */
  title: string;
  /** Icon component (e.g. from lucide-react) rendered before the title. */
  icon: ComponentType<{ className?: string }>;
  /** Optional actions rendered at the end of the header. */
  actions?: ReactNode;
  /** Panel body. */
  children?: ReactNode;
  /** Extra classes for the outer element (e.g. sizing in a flex layout). */
  className?: string;
}

/**
 * A titled card used as the building block for every region of the app (work
 * area, graph, context). Built on the shadcn Card primitives with a scrollable
 * body. Purely presentational.
 */
export function Panel({ title, icon: Icon, actions, children, className }: PanelProps) {
  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
      <CardHeader className="flex flex-row items-center gap-2 px-4 py-2.5">
        <Icon className="size-4 text-muted-foreground" />
        <CardTitle className="text-sm">{title}</CardTitle>
        {actions ? <CardAction className="ml-auto self-center">{actions}</CardAction> : null}
      </CardHeader>
      <Separator />
      <CardContent className="min-h-0 flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-4">{children}</div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
