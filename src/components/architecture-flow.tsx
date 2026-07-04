import { ArrowRight } from "lucide-react"
import type { FlowNode } from "@/lib/projects"

export function ArchitectureFlow({
  nodes,
  note,
}: {
  nodes: FlowNode[]
  note?: string
}) {
  return (
    <div>
      <div className="flex flex-wrap items-stretch gap-2">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center gap-2">
            <div className="flex min-w-[9rem] flex-1 flex-col justify-center rounded-lg border border-border bg-secondary/60 px-3 py-2">
              <span className="font-mono text-[11px] leading-tight text-foreground">
                {node.label}
              </span>
              {node.sub ? (
                <span className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {node.sub}
                </span>
              ) : null}
            </div>
            {i < nodes.length - 1 ? (
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground"
              />
            ) : null}
          </div>
        ))}
      </div>
      {note ? (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {note}
        </p>
      ) : null}
    </div>
  )
}
